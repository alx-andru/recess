var fs    = require('fs');     // nodejs.org/api/fs.html
var plist = require('plist');  // www.npmjs.com/package/plist

var FILEPATH = 'platforms/ios/Recess/Recess-Info.plist';

module.exports = function (context) {

  var xml = fs.readFileSync(FILEPATH, 'utf8');
  var obj = plist.parse(xml);

  obj.NSHealthShareUsageDescription = 'Assist to break sedentary phases.';
  obj.NSHealthUpdateUsageDescription = 'Assist to break sedentary phases.';

  // fix for plist bug
  obj.NSMainNibFile = '';
  obj['NSMainNibFile~ipad'] = '';

  xml = plist.build(obj);
  fs.writeFileSync(FILEPATH, xml, { encoding: 'utf8' });

};