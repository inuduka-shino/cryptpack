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

    const propUtil = ((propNameList)=>{
      const propStruct = propNameList.map((propName)=>{
        const propNameStruct = propName.split('.');

        return [propNameStruct, propNameStruct.length - 1];
      });

      function getVal(propNameList, rootObj) {
        return propNameList.reduce((obj, propName)=>{
          return obj[propName];
        }, rootObj);
      }
      //eslint-disable-next-line max-params
      function setVal(propNameList, lastIndex, rootObj, val) {
        propNameList.reduce((obj, propName, index)=>{
          if (index === lastIndex) {
            obj[propName] = val;

            return null;
          }

          return obj[propName];
        }, rootObj);

      }

      function genMemberObj([propNameList, lastIndex]) {
        return {
          getVal: getVal.bind(null, propNameList),
          setVal: setVal.bind(null, propNameList, lastIndex),
        };
      }
      function forEach(func) {
        propStruct.forEach((propNameStruct)=>{
          return func(genMemberObj(propNameStruct));
        });
      }

      return {
        //
        forEach,
      };
    })(propList);

    async function init() {
      if (saveImage!==null) {
        throw new Error('already init');
      }
      const loadData = await saver.load();

      if (loadData === null) {
        if (typeof initSaveData === 'undefined') {
          saveImage = {};
        } else {
          saveImage = initSaveData;
        }
      } else {
        saveImage = loadData;
      }
      propUtil.forEach((member)=>{
        const val = member.getVal(saveImage);

        if (typeof val !== 'undefined') {
          member.setVal(cntxt, val);
        }
      });
    }

    async function flush() {
      if (saveImage === null) {
        throw new Error('not init, yet');
      }
      propUtil.forEach((member)=>{
        const val = member.getVal(cntxt);

        member.setVal(saveImage, val);
      });
      await saver.save(saveImage);
    }

    return {
      init,
      flush,
    };
  };
});
