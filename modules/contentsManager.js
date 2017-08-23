/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile');

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

  function generateContentsID(self) {
    self.dataInfo.counter += 1;
    const counter = self.dataInfo.count;

    if (counter > 99999) {
      throw new Error(`overflow countentsID count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [self.contentsIdBase, 'CA', counterStr].join('');

  }

  function generate(info) {
    // info = {
    //   contentsIdBase,
    //   jsonFilePath,
    //   destFileFolderPath,
    // }
    const cntxt = {
      jsonfile: jsonFile(info.jsonFilePath),
      dataInfo: null,
      contentsIdBase: info.contentsIdBase,
      destFileFolderPath: info.destFileFolderPath,
    };

    const saver = jsonFile.saverFeature(genProxy(
                    cntxt,
                    {
                      'saver': 'jsonfile',
                      'dataInfo': 'dataInfo',
                    }
                  ));
    const saverLoad = saver.load.bind(null,{
                        title:'contents map',
                        // for countns id
                        counter: 0,
                        contentsInfo: {},
                        // {contentsID: {
                        //   sourcePath: '....',
                        //   destPath: '....',
                        // }, ...}
                        clientContentMap: {},
                        // {clientId: [contentsID, ....]',...}
                      });

    return {
      dev: {
        load: saverLoad,
        save: saver.save,
        generateContentsID: generateContentsID.bind(null,cntxt),
        cntxt,
      },
    };
  }

  return generate;
});
