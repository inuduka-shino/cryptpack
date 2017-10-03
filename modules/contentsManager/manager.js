/* contentsManager: manager.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),
        stream = require('stream'),

        generateContentsID = require('./generateContentsID');
        //contentsCtrl = require('./contentsCtrl');

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
          contentsId = generateContentsID(cntxt);

    const destStream = fs.createWriteStream(
            path.join(destFolderPath, contentsId),
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
    if (typeof cntxt.contentsInfo[contentsId] !== 'undefined') {
      throw new Error(`alrady contentsId exist. (${contentsId})`);
    }
    cntxt.contentsInfo[contentsId] = {
      title: docInfoCntxt.title,
      sourcePath: docInfoCntxt.srcPath,
    };
    cntxt.clientContentMap[clientID].contentsList.push(contentsId);

    return contentsId;
  }

  function deleteContents(ccntxt, contentsId) {
    // TODO:
    console.log(`${contentsId}`);
    //cntxt.clientContentMap[clientID].contentsList.UNpush(contentsId);
    // 削除promiseもcontentsListに入れる。
  }

  function regist(ccntxt) {
    // インデックスファイル生成
    // コンテンツ生成終了待ち
    const managerCntxt = ccntxt.managerCntxt,
          cientContentInfo = managerCntxt.clientContentMap[ccntxt.clientID];

    deleteContents(ccntxt, cientContentInfo.indexContents);

    // TODO: indexcontents イメージ
    const idexContensInfo = genDocInfo(cientContentInfo.contentsList);
    const indexContentsID = add(ccntxt, idexContensInfo);
    cientContentInfo.indexContents = indexContentsID;

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
        deleteContents: deleteContents.bind(null, ccntxt),
    };
  }

  return {
    init,
    genDocInfo,
    client,
  };
});
