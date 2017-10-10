/* contentsManager: manager.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const debug = Symbol.for('debug');

  const path = require('path'),
        fs = require('fs'),
        stream = require('stream'),
        util = require('util'),

        generateContentsID = require('./generateContentsID');
        //contentsCtrl = require('./contentsCtrl');
  const fsUnlink =util.promisify(fs.unlink);

  const {
    genDocInfo,
    genIndexContents,
  } = require('./docInfo');

  async function init(cntxt) {
    await cntxt.saver.init();
  }

  function addImpl(ccntxt, execMode, docInfo) {
    // コンテンツファイル生成開始
    const cntxt = ccntxt.managerCntxt;
    const clientID = ccntxt.clientID;

    const destFolderPath = cntxt.destFileFolderPath,
          contentsID = generateContentsID(cntxt);

    const destStream = fs.createWriteStream(
            path.join(destFolderPath, contentsID),
            {
              flags:'wx'
            }
          );

    //  translate for encript
    const encStream = new stream.PassThrough();
    docInfo.stream.pipe(encStream).pipe(destStream);

    const contentsWrote = (()=>{
      return new Promise((resolve)=>{
        destStream.on('close', () => {
            resolve();
        });
      });
    })();
    ccntxt.wroteContents.push(contentsWrote);

    if (typeof cntxt.clientContentMap[clientID] === 'undefined') {
        cntxt.clientContentMap[clientID] = {
          contentsList: [],
          indexContentsIndex: null,
        };
    }
    const contentsList = cntxt.clientContentMap[clientID].contentsList,
          newIndex = contentsList.length;

    contentsList.push(contentsID);


    // set contents Information
    if (typeof cntxt.contentsInfo[contentsID] !== 'undefined') {
      throw new Error(`alrady contentsId exist. (${contentsID})`);
    }
    cntxt.contentsInfo[contentsID] = docInfo.saveImage;

    if (execMode.retType === 'contentsID') {
      return contentsID;
    }
    return newIndex;
  }

  function deleteContentsImpl(param) {
    // param mamber is
    // contentsInfo, contentsList, index, contentsID, wroteContents, destFileFolderPath
    param.contentsList.splice(param.index,1);
    Reflect.deleteProperty(param.contentsInfo, param.contentsID);
    const destPath = path.join(param.destFileFolderPath, param.contentsID);

    param.wroteContents.push(fsUnlink(destPath));
  }

  function deleteContentsByIndex(ccntxt, index) {
    const cntxt = ccntxt.managerCntxt,
          clientID = ccntxt.clientID,
          contentsList = cntxt.clientContentMap[clientID].contentsList;

    deleteContentsImpl({
      contentsInfo: cntxt.contentsInfo,
      contentsList,
      index,
      contentsID: contentsList[index],
      wroteContents: ccntxt.wroteContents,
      destFileFolderPath: cntxt.destFileFolderPath
    });
  }
  function deleteContentsByContentsID(ccntxt, contentsID) {
    const cntxt = ccntxt.managerCntxt,
          clientID = ccntxt.clientID,
          contentsList = cntxt.clientContentMap[clientID].contentsList;

    const index = contentsList.indexOf(contentsID);

    deleteContentsImpl({
      contentsInfo: cntxt.contentsInfo,
      contentsList,
      index,
      contentsID,
      wroteContents: cntxt.wroteContents,
      destFileFolderPath: cntxt.destFileFolderPath
    });
  }

  function regist(ccntxt) {
    // インデックスファイル生成
    // コンテンツ生成終了待ち
    const managerCntxt = ccntxt.managerCntxt,
          cientContentInfo = managerCntxt.clientContentMap[ccntxt.clientID];

    if (cientContentInfo.indexContentsIndex !== null) {
      deleteContentsByIndex(ccntxt, cientContentInfo.indexContentsIndex);
    }
    const idexContensInfo = genDocInfo([
      'text',
      genIndexContents(managerCntxt.contentsInfo, cientContentInfo.contentsList),
      'IndexContents'
    ]);
    const index = addImpl(ccntxt, {
      retType: 'index'
    }, idexContensInfo);
    cientContentInfo.indexContentsIndex = index;

    const wroteSaver = managerCntxt.saver.flush();

    const wroteContents = ccntxt.wroteContents;
    ccntxt.wroteContents = [];
    return Promise.all(wroteContents.concat(wroteSaver));
  }

  function getIndexContentsID(ccntxt) {
    const clientInfo = ccntxt.managerCntxt.clientContentMap[ccntxt.clientID],
          idx = clientInfo.indexContentsIndex;
    return clientInfo.contentsList[idx];
  }
  function client(managerCntxt, clientID) {
    const ccntxt = {
      managerCntxt,
      clientID,
      wroteContents: [],
    };

    return {
        [debug]: ccntxt,
        add: addImpl.bind(null, ccntxt, {
          retType:'contentsID'
        }),
        regist: regist.bind(null, ccntxt),
        deleteContents: deleteContentsByContentsID.bind(null, ccntxt),
        getIndexContentsID: getIndexContentsID.bind(null, ccntxt),
    };
  }

  return {
    init,
    genDocInfo,
    client,
  };
});
