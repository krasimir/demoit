const fs = require('fs');
const version = require(__dirname + '/../package.json').version;
const content = fs.readFileSync(__dirname + '/../src/sw.js').toString('utf8');

fs.writeFileSync(__dirname + '/../dist/sw.js', content.replace('{version}', version))