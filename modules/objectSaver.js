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
  return ({cntxt, saver, propList, initSaveData})=>{
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
      propList.forEach((propName)=>{
        const val = saveImage[propName];

        if (typeof val !== 'undefined') {
          cntxt[propName] = val;
        }
      });
    }

    function flush() {
      if (saveImage === null) {
        throw new Error('alrady not init');
      }
      propList.forEach((propName)=>{
          saveImage[propName] = cntxt[propName];
      });
      saver.save(saveImage);
    }

    return {
      init,
      flush,
    };
  };
});
