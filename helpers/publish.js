const childProcess = require('child_process');
const version = require('../package.json').version;
const name = require('../package.json').name;
const options = {encoding: 'utf8', maxBuffer: 50 * 1024 * 1024};
const viewBuffer = childProcess.execSync(`npm view arachne-ui@${version}`, options);
const versionFound = viewBuffer.toString().includes(version);
if (versionFound) {
    console.error(`Skip publish because version ${name}.${version} is already published`);
    process.exit(1);
} else {
    const publishBuffer = childProcess.execSync(`npm publish`, options);
    console.log('publishing output:', publishBuffer.toString());
}
