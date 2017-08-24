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

  return {genProxy};
});
