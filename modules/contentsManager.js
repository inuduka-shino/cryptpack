/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile'),
        //{genProxy} = require('./featureUtil'),
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
          // for countns id
          counter: 0,
          contentsInfo: {},
          // {contentsID: {
          //   sourcePath: '....',
          //   destPath: '....',
          // }, ...}
          clientContentMap: {},
          // {clientId: [contentsID, ....]',...}
        },
        propMap = [
          'counter',
          'contentsInfo',
          'clientContentMap',
        ].reduce((o,name)=>{
          o[name] = name;

          return o;
        },{}),
        initSaveData = {
          //
          title:'contents map',
        };

    const saver = objectSaver({
        cntxt,
        saver: jsonFile(info.jsonFilePath),
        propMap,
        initSaveData
      });

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
