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

define((require)=>{
  const featureUtil = require('./featureUtil');

  //eslint-disable-next-line max-params
  return (cntxt, saver, propMap, initData)=>{
    const saveImage = featureUtil.genProxy(cntxt, propMap);
    let loaded = false;

    function init() {
      let loadData = null;

      if (loaded) {
        return;
      }
      loadData = saver.load();
      if (loadData === null) {
        loadData = initData;
      }
      Object.entries(loadData).forEach(([key,val])=>{
          saveImage[key] = val;
      });
      loaded = true;
    }
    function flush() {
        saver.save(saveImage);
    }

    return {
      init,
      flush,
    };
  };
});
