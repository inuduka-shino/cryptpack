/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile');

  async function load(self) {
    let dataInfo = await self.jsonfile.load();

    if (dataInfo===null) {
      dataInfo = {
          aaa:'aaa',
          bbb:'bbb',
        };
    }
    self.dataInfo = dataInfo;
  }
  async function save(self) {
    await self.jsonfile.save(self.dataInfo);
  }

  function generate(filePath) {
    const self = {
      jsonfile: jsonFile(filePath),
      dataInfo: null,
    };

    return {
      load: load.bind(null,self),
      save: save.bind(null,self),
    };
  }

  return generate;
});
