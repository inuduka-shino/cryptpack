/* jsonFile.js */
/*eslint-env node */

function define(func) {
  module.exports = func(require);
}


define((require)=>{

  const fs = require('fs'),
        util = require('util');

  const fsReadFile = util.promisify(fs.readFile),
        fsWriteFile = util.promisify(fs.writeFile);

  function load(self) {
    const loadPromise = fsReadFile(
      self.filePath,
      {
          flag: 'r',
          encoding: 'utf8'
        }
      );

    return (
      loadPromise
      .then((data) => {
          return JSON.parse(data);
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return null;
        }
        throw new Error(`Mapfile read error! err.code=(${err.code}) filepath=(${self.filePath})`);
      })
    );
  }

  function save(self, data) {
    return fsWriteFile(
      self.filePath,
      JSON.stringify(data),
      {
        flag: 'w',
        encoding: 'utf8'
      }
    );
  }

  function generate(filePath) {
    const self = {
      filePath,
      selfIF: null,
    };

    self.selfIF = {
      load: load.bind(null, self),
      save: save.bind(null, self),
    };

    return self.selfIF;
  }

  // saver utilty
  // Object save&load
  // addFeature(self)
  //self: {
  //  dataInfo,  : plainObject 対象データ
  //  saver : saver.save/ saver.load
  //  laod: adding method
  //  save: adding method
  //}
  async function utilLoad(cntxt, initObj) {
    if (cntxt.dataInfo !== null) {
      throw new Error('alrady loaded.');
    }
    let dataInfo = await cntxt.saver.load();

    if (dataInfo===null) {
      dataInfo = initObj;
    }
    cntxt.dataInfo = dataInfo;
  }
  async function utilSave(self) {
    await self.saver.save(self.dataInfo);
  }

  function saverFeature(cntxt) {
    return {
      load: utilLoad.bind(null, cntxt),
      save: utilSave.bind(null, cntxt),
    };
  }

  generate.saverFeature = saverFeature;

  return generate;
});
