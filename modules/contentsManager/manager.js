/* contentsManager: manager.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),
        stream = require('stream'),
        util = require('util'),

        generateContentsID = require('./generateContentsID');
        //contentsCtrl = require('./contentsCtrl');
  const fsUnlink =util.promisify(fs.unlink);

  const docInfoSymbol = Symbol('docInfo context');
  const genDocInfo = require('./docInfo').bind(null, docInfoSymbol);

  async function init(cntxt) {
    await cntxt.saver.init();
  }

  function add(ccntxt, docInfo) {
    // コンテンツファイル生成開始
    const docInfoCntxt = docInfo[docInfoSymbol];
    // docInfoCntxt = {
    //   stream
    //   title
    // }
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
    const encStream = stream.stream.PassThrough;
    docInfoCntxt.stream.pipe(encStream).pipe(destStream);

    const contentsWrote = (()=>{
      return new Promise((resolve)=>{
        destStream.on('close', () => {
            resolve();
        });
      });
    })();
    cntxt.wroteContents.push(contentsWrote);

    // set contents Information
    if (typeof cntxt.contentsInfo[contentsID] !== 'undefined') {
      throw new Error(`alrady contentsId exist. (${contentsID})`);
    }

    const contentsList = cntxt.clientContentMap[clientID].contentsList;

    contentsList.push(contentsID);
    cntxt.contentsInfo[contentsID] = {
      title: docInfoCntxt.title,
      sourcePath: docInfoCntxt.srcPath,
    };

    return contentsID;
  }

  function deleteContentsImpl(param) {
    // param mamber is
    // contentsInfo, contentsList, index, contentsID, wroteContents, destFileFolderPath
    param.contentsList.splice(param.index,1);
    Reflect.deleteProperty(param.contentsInfo, param.contentsID);
    const destPath = path.join(param.destFileFolderPath, param.contents.ID);

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
      wroteContents: cntxt.wroteContents,
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

    deleteContentsByIndex(ccntxt, cientContentInfo.indexContentsIndex);

    // TODO: indexcontents イメージ
    const idexContensInfo = genDocInfo(cientContentInfo.contentsList);
    const [, index] = add(ccntxt, idexContensInfo);
    cientContentInfo.indexContentsIndex = index;

    const wroteSaver = managerCntxt.saver.flush();

    const wroteContents = ccntxt.wroteContents;
    ccntxt.wroteContents = [];
    return Promise.all(wroteContents.concat(wroteSaver));
  }

  function client(managerCntxt, clientID) {
    const ccntxt = {
      managerCntxt,
      clientID,
      wroteContents: [],
    };

    return {
        add: add.bind(null, ccntxt),
        regist: regist.bind(null, ccntxt),
        deleteContents: deleteContentsByContentsID.bind(null, ccntxt),
    };
  }

  return {
    init,
    genDocInfo,
    client,
  };
});
