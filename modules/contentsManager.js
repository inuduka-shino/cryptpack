/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile');
  const contentsIdBase = 'ACS002';

  function generateContentsID(self) {
    self.dataInfo.counter += 1;
    const counter = self.dataInfo.count;

    if (counter > 99999) {
      throw new Error(`overflow countentsID count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [contentsIdBase, 'CA', counterStr].join('');

  }
  async function load(self) {
    if (self.dataInfo !== null) {
      return;
    }
    let dataInfo = await self.jsonfile.load();

    if (dataInfo===null) {
      dataInfo = {
          title:'contents map',
          // for countns id
          counter: 0,
          // {contentsID: {
          //   sourcePath: '....',
          //   destPath: '....',
          // }, ...}
          contentsInfo: {},
          // {clientId: [contentsID, ....]',...}
          clientContentMap: {},
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
      dev: {
        load: load.bind(null,self),
        save: save.bind(null,self),
        generateContentsID: generateContentsID.bind(null,self),
        self,
      },
    };
  }

  return generate;
});
