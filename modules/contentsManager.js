/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile'),
        {genProxy} = require('./featureUtil'),
        objectSaver = require('./objectSaver');

  function generateContentsID(cntxt) {
    // cntxt.counter
    // cntxt.prefix
    cntxt.counter += 1;
    const counter = cntxt.counter;

    if (counter > 99999) {
      throw new Error(`overflow countentsID count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [cntxt.prefix, counterStr].join('');
  }

  function generate(info) {
    // input: info = {
    //   contentsIdBase,
    //   jsonFilePath,
    //   destFileFolderPath,
    // }
    const cntxt = {
      saverInfo: null,
      //contentsIdBase: info.contentsIdBase,
      //destFileFolderPath: info.destFileFolderPath,
    };
    const jsonfile = jsonFile(info.jsonFilePath),
          cntxt = {
          },
          loaded = false,
          initSaveData = {
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
          };

    const saver = objectSaver({
              save: jsonfile.save,
              load: jsonfile.load,
              targetData,
              initData
            });

    const genContentsID = generateContentsID(

    );
    const saver = ((cntxt, mapHandler)=>{
      const saveImage = new Proxy(cntxt, mapHandler);
      function init() {
        if (cntxt.loaded) {
          return;
        }
        const loadData = jsonfile.load();
        if (loadData === null) {
          loadData = initData;
        }
        Object.entries(loadData).forEach(([key,val])={
            saveImage[key] = val;
        });
        cntxt.loaded = true;
      }
      function flush() {
          jsonfile.save(saveImage);
      }
      return {
        init,
        flush,
      }
    })();
    return {
      dev: {
        init: saver.init,
        save: saver.save,
        generateContentsID: generateContentsID.bind(null,cntxt),
        cntxt,
      },

    };
  }

  return generate;
});
