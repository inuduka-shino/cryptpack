/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile');

  function generate(filePath) {
      const jsonfile = jsonFile(
        filePath,
        {
          aaa:'aaa',
          bbb:'bbb',
        }
      );

    return {
      load: jsonfile.load,
      save: jsonfile.save
    };
  }

  return generate;
});
