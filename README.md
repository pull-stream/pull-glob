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

## License

MIT
