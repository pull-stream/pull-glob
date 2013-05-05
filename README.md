# pull-glob

streaming extended glob.

use with [pull-stream](https://github.com/dominictarr/pull-stream)

## examples

``` js
var pull = require('pull-stream')
var glob = require('pull-glob')

glob('.')      .pipe(log()) // current dir
glob('*.js')   .pipe(log()) // current dir
glob('**')     .pipe(log()) // everything under current dir
glob('**/*.js').pipe(log()) // .js recursively
glob('...')    .pipe(log()) // parent directories
glob('.../.*') .pipe(log()) // hidden files
glob('.../node_modules/*')
                .pipe(log()) // available modules!
glob('.../{package,component}.json')
                .pipe(log()) // search for local package files.

function log () {
  return pull.drain(console.log)
}
```

## stopping early

because this module uses pull-streams, it's lazy,
so you can do queries like the following:

``` js
//find the first package.json in a parent directory.
glob('.../package.json').pipe(pull.take(1)).pipe(log())
```

And you will retrive only the first item, and _will
not do any extra IO_. This is hugely useful when
doing a large traversal...

## collect node_module tree

``` js
glob('**/node_modules/*/package.json')
  .pipe(pull.collect(function (e, arr) {
    console.log(arr)
  })

```

## License

MIT
