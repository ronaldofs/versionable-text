var VersionableText = require('./src/versionable-text');

var versionable = new VersionableText('This is the original version');
versionable.addVersion('This is the first version');
versionable.addVersion('This is the second version');

console.log('original version:', versionable.text);
console.log('first version   :', versionable.getVersion(1));
console.log('second version  :', versionable.getVersion(2));
console.log('latest version  :', versionable.getLatest());
