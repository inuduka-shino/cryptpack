/* ObjectSaver.js */
/*eslint-env node */
// Object saver utilty
// Object save&load
// saverFeature(cntxt)
//cntxt: {
//  dataInfo,  : plainObject 対象データ
//  saver : saver.save/ saver.load
//}
// output:
//{
//  laod(initObj): load Object from saver or initObj
//  save: save Object
//}

function define(func) {
  module.exports = func(require);
}

define(()=>{
  async function load(cntxt, initObj) {
    if (cntxt.dataInfo !== null) {
      throw new Error('alrady loaded.');
    }
    let dataInfo = await cntxt.saver.load();

    if (dataInfo===null) {
      dataInfo = initObj;
    }
    cntxt.dataInfo = dataInfo;
  }
  async function save(self) {
    await self.saver.save(self.dataInfo);
  }

  return function (cntxt) {
    return {
      load: load.bind(null, cntxt),
      save: save.bind(null, cntxt),
    };
  };
});
