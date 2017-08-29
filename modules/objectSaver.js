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
  //eslint-disable-next-line max-params
  return ({cntxt, saver, propMap, initSaveData})=>{
    let loaded = false;

    function init() {
      if (loaded) {
        return;
      }
      let loadData = saver.load();

      if (loadData === null) {
        loadData = initSaveData;
      }
      Object.entries(propMap).forEach(([sKey,cKey])=>{
          cntxt[cKey] = loadData[sKey];
      });
      loaded = true;
    }
    function flush() {
      const saveImage={};

      Object.entries(propMap).forEach(([sKey,cKey])=>{
          saveImage[sKey] = cntxt[cKey];
      });
      saver.save(saveImage);
    }

    return {
      init,
      flush,
    };
  };
});
