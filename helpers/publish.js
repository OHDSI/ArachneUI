var cmd = require('node-command-line');
var version = require('../package.json').version;
var name = require('../package.json').name;

var result = cmd.run('npm info ' + name + '@' + version);
result.then((r) => {
  if (!r.message.length) {
    // version is not published yet
    cmd.run('npm publish');
  }else{
    console.warn(`Skip publish because version ${name}.${version} is already published`);
    process.exit(1);
  }
});