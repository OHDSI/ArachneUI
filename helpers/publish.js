var cmd = require('node-command-line');
var version = require('../package.json').version;
var name = require('../package.json').name;

var result = cmd.run('npm info ' + name + '@' + version);
result.then((r) => {
  if (!r.message.length) {
    // version is not published yet
    cmd.run('npm publish');
  }

});