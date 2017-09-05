/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile'),
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
    //   destFileBasePath,
    // }
    const cntxt = {
          //contentsIdBase: info.contentsIdBase,
          //destFileFolderPath: info.destFileFolderPath,
          // for countns id
          counter: 0,
          contentsInfo: {},
          // {contentsID: {
          //   clientId: '....',
          //   sourcePath: '....',
          //   destPath: '....',
          // }, ...}
          clientContentMap: {},
          // {clientId: [contentsID, ....]',...}
        },
        savePropList = [
          'counter',
          'contentsInfo',
          'clientContentMap',
        ],
        initSaveData = {
          //
          title:'contents map',
        };

    const saver = objectSaver({
        cntxt,
        saver: jsonFile(info.jsonFilePath),
        propList: savePropList,
        initSaveData
      });

    saver.init();

    function registContents(clientId, srcPath) {
      const contentsId = generateContentsID(cntxt);

      console.log(`clientId=${clientId}`);
      console.log(`srcPath=${srcPath}`);
      console.log(`contentsId=${contentsId}`);

      if (typeof cntxt.contentsInfo[contentsId] !== 'undefined') {
        throw new Error(`alrady contentsId exist. (${contentsId})`);
      }
      cntxt.contentsInfo[contentsId] = {
        clientId,
        sourcePath: srcPath,
        //   destPath: '....',
      };
      if (typeof cntxt.clientContentMap[clientId] === 'undefined') {
        cntxt.clientContentMap[clientId] = [];
      }
      cntxt.clientContentMap[clientId].push(contentsId);

      return contentsId;
    }

    return {
      dev: {
        generateContentsID: generateContentsID.bind(null,cntxt),
        cntxt,
      },
      registContents,
      // getContentsInfo,
    };
  }

  return generate;
});
