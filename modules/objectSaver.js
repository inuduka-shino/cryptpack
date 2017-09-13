/* ObjectSaver.js */
/*eslint-env node */
// Object saver utilty
// Object info to saved
// ObjectSaver(paramObj)
// paramObj: {
// objInfo, saver, propMap, initSaveData
// }
// objInfoのメンバとsaveImageのメンバをpropMapで紐づけ
// saveImageをJsonFileでsave,loadする後、前で
// 紐づけに従い値を同期（一方をもう一方へ代入）する。
// return val
// {
//   init()
//   flush()
// }

function define(func) {
  module.exports = func(require);
}

define(()=>{

  const genPropUtil = (()=>{
    function getVal(propNameList, rootObj) {
      // propNameListは 'a.b.c'に対応した['a','b','c']
      // {a:{b:{c:val}}} の valが取得できる
      return propNameList.reduce((obj, propName)=>{
        return obj[propName];
      }, rootObj);
    }

    //eslint-disable-next-line max-params
    function setVal(propNameList, lastIndex, rootObj, val) {
      // propNameListは 'a.b.c'に対応した['a','b','c']
      // lastIndexはこのarrayの最後の要素のindex
      // {a:{b:{c:old_val}}} のold_valに valに変更できる
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

    function forEach(propStruct, func) {
      propStruct.forEach((propNameStruct)=>{
        return func(genMemberObj(propNameStruct));
      });
    }

    function genPropUtil(propNameList) {
      const propStruct = propNameList.map((propName)=>{
        const propNameStruct = propName.split('.');

        return [propNameStruct, propNameStruct.length - 1];
      });


      return {
        //
        forEach: forEach.bind(null, propStruct),
      };
    }

    return genPropUtil;
  })();

  function loaded(cntxt) {
    return cntxt.saveImage!==null;
  }

  async function init(cntxt) {
    if (cntxt.saveImage!==null) {
      throw new Error('already init');
    }
    const loadData = await cntxt.saver.load();

    if (loadData === null) {
      if (typeof cntxt.initSaveData === 'undefined') {
        cntxt.saveImage = {};
      } else {
        cntxt.saveImage = cntxt.initSaveData;
      }
    } else {
      cntxt.saveImage = loadData;
    }
    cntxt.propList.forEach((member)=>{
      const val = member.getVal(cntxt.saveImage);

      if (typeof val !== 'undefined') {
        member.setVal(cntxt.objInfo, val);
      }
    });
  }

  async function flush(cntxt) {
    if (cntxt.saveImage === null) {
      throw new Error('not init, yet');
    }
    cntxt.propList.forEach((member)=>{
      const val = member.getVal(cntxt.objInfo);

      member.setVal(cntxt.saveImage, val);
    });
    await cntxt.saver.save(cntxt.saveImage);
  }

  //eslint-disable-next-line max-params
  return ({objInfo, saver, propList, initSaveData})=>{
    const cntxt = {
      objInfo,
      saver,
      initSaveData,
      //
      propList: genPropUtil(propList),
      saveImage: null,
    };

    return {
      loaded: loaded.bind(null, cntxt),
      init: init.bind(null,cntxt),
      flush: flush.bind(null, cntxt),
    };
  };
});
