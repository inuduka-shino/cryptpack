/* ObjectSaver.js */
/*eslint-env node */
// Object saver utilty
// Object info to saved
// ObjectSaver(paramObj)
// paramObj: {
// cntxt, saver, propMap, initSaveData
// }
// return val
// {
//   init()
//   flush()
// }

function define(func) {
  module.exports = func(require);
}

define(()=>{
  //eslint-disable-next-line max-params
  return ({cntxt, saver, propMap, initSaveData})=>{
    let saveImage = null;

    function init() {
      if (saveImage!==null) {
        throw new Error('already init');
      }
      const loadData = saver.load();

      if (loadData === null) {
        if (typeof initSaveData === 'undefined') {
          saveImage = {};
        } else {
          saveImage = initSaveData;
        }
      } else {
        saveImage = loadData;
      }
      Object.entries(propMap).forEach(([sKey,cKey])=>{
        const val = saveImage[sKey];

        if (typeof val !== 'undefined') {
          cntxt[cKey] = val;
        }
      });
    }

    function flush() {
      if (saveImage === null) {
        throw new Error('alrady not init');
      }
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
