var cmd = require('node-command-line');
var version = require('../package.json').version;

var result = cmd.run('npm info arachne-ui-components@' + version);
result.then((r) => {
  if (!r.message.length) {
    // version is not published yet
    cmd.run('npm publish');
  }

});