var pfs  = require('pull-fs')
var pull = require('pull-stream')
var path = require('path')
var glob =
module.exports = function (x) {

  var rest = path.normalize(x).split('/')
  var stream

  function pipe (next) {
    if(!stream)
      stream = next
    else
      stream = stream.pipe(next)
  }

  if(rest[0] == '...') {
    pipe(pfs.ancestors())
    rest.shift()
  } else if(rest[0] === '~' || rest[0] === '') {
    pipe(pull.values([rest.shift() ? process.env.HOME : '/']))
  } else {
    pipe(pull.values(['.']))
  }

  //this should be tidied up.
  //need a more betterer glob parser
  //that handles escapes...
  rest.forEach(function (e) {
    if('**' === e) {
      pipe(pfs.starStar())
    } else if(/[*?]/.test(e)) {
      //literal
      e = e
        .split('.').join('\\.')
        .split('?').join('.')
        .split(/({.*?})/).map(function (e, i) {
        if(i % 2)
          return e.replace('{', '(?:')
                  .replace('}', ')')
                  .split(',').join('|')
        return e
      }).join('')

      var x = new RegExp('^'+e.split('*').join('.*')+'$')
      pipe(pfs.star(x))
    } else if(e === '')
      //will only happen in the last position
      //if you do */
      pipe(pfs.isDirectory())
    else
      pipe(pfs.resolve(e).pipe(pfs.exists()))
  })

  return stream
}

if(!module.parent) {
  s = module.exports(process.argv[2])

  if(/-f|--first/.test(process.argv[3]))
    s = s.pipe(pull.take(1))

  s.pipe(pull.drain(console.log))
}
