/* featureUtil.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define(() => {
  function realPropNameFromMap(propMap, propName) {
    const realPropName = propMap[propName];

    if (typeof realPropName === 'undefined') {
      throw new Error(`member ${propName} is no-mapping!`);
    }

    return realPropName;
  }
  function proxyHandler(propMap) {
    const realPropName = realPropNameFromMap.bind(null, propMap);

    return {
      get (targetObj, propName) {
        return targetObj[realPropName(propName)];
      },
      set (targetObj, propName, val) {
        targetObj[realPropName(propName)] = val;
      },
    };
  }

  function genProxy(targetObj, propMap) {
    return new Proxy(targetObj, proxyHandler(propMap));
  }

  // new version
  function contextProxyObject(allowProps, refObj, transProps) {
    // allowProps: 読み書き可能（独自オブジェクト）
    // transProps: refObjとマップ
    const selfObj = {};
    return new Proxy(selfObj, {
      get (selfObj, name) {
        if (allowProps.include(name)) {
          return selfObj[name];
        }
        if (transProps.includes(name)) {
          return refObj[name];
        }
        throw new Error(`can not read property name(${name})`);
      },
      set (selfObj, name, val) {
        if (allowProps.include(name)) {
          selfObj[name] = val;
        }
        if (transProps.includes(name)) {
          refObj[name] = val;
        }
        throw new Error(`can not write property name(${name})`);
      }
    });
  }
  return {
    genProxy,
    contextProxyObject,
  };
});
