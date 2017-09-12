/* contentsManager.js */
/*eslint-env node,  */
/*global  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),
        jsonFile = require('./jsonFile'),
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

    return [cntxt.contentsIdBase, counterStr].join('');
  }
  async function init(cntxt) {
    await cntxt.saver.init();
  }

  async function regist(cntxt, clientId, srcPath) {
    const destFolderPath = cntxt.destFileFolderPath;

    const contentsId = generateContentsID(cntxt),
          destStream = fs.createWriteStream(
            path.join(destFolderPath, contentsId),
            {flags:'wx'}
          ),
          srcStream = fs.createReadStream(srcPath);

    if (typeof cntxt.contentsInfo[contentsId] !== 'undefined') {
      throw new Error(`alrady contentsId exist. (${contentsId})`);
    }

    const contentsWrited = (()=>{
      return new Promise((resolve)=>{
        destStream.on('close', () => {
            resolve();
        });
      });
    })();

    //  translate for encript
    srcStream.pipe(destStream);

    cntxt.contentsInfo[contentsId] = {
      clientId,
      sourcePath: srcPath,
      //   destPath: '....',
    };
    if (typeof cntxt.clientContentMap[clientId] === 'undefined') {
      cntxt.clientContentMap[clientId] = [];
    }

    cntxt.clientContentMap[clientId].push(contentsId);
    const configWrited = cntxt.saver.flush();

    await Promise.all([contentsWrited, configWrited]);

    return contentsId;
  }

  function generate(info) {
    // input: info = {
    //   contentsIdBase,
    //   jsonFilePath,
    //   destFileBasePath,
    // }
    const cntxt = {
          contentsIdBase: info.contentsIdBase,
          destFileFolderPath: info.destFileFolderPath,
          saver: null,
          // mapping from json filePath
          counter: null,
          contentsInfo: null,
          clientContentMap: null,
        };

    cntxt.saver = objectSaver({
        objInfo:cntxt,
        saver: jsonFile(info.jsonFilePath),
        propList:  [
          'counter',
          'contentsInfo',
          'clientContentMap',
        ],
        initSaveData:{
          //
          title:'contents map',
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
      });


    return {
      dev: {
        generateContentsID: generateContentsID.bind(null,cntxt),
        cntxt,
      },

      init:  init.bind(null, cntxt),
      regist: regist.bind(null, cntxt),
      // getContentsInfo,
    };
  }

  return generate;
});
