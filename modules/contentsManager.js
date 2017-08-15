/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const fs = require('fs'),
        util = require('util');
  const fsReadFile = util.promisify(fs.readFile),
        fsWriteFile = util.promisify(fs.writeFile);



  return {
      aaa: 'aaa',
      bbb: 'bbbb',
  };
});
