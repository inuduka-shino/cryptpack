/* contentsManager: manager.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),

        generateContentsID = require('./generateContentsID');
        //contentsCtrl = require('./contentsCtrl');

  const docInfoSymbol = Symbol('docInfo context');
  const genDocInfo = require('./docInfo').bind(null, docInfoSymbol);

  async function init(cntxt) {
    await cntxt.saver.init();
  }

  function add(ccntxt, docInfo) {
    const docInfoCntxt = docInfo[docInfoSymbol];
    // docInfoCntxt = {
    //   stream
    //   title
    // }
    const cntxt = ccntxt.super;
    const clientID = ccntxt.clientID;

    const destFolderPath = cntxt.destFileFolderPath;
    const contentsId = generateContentsID(cntxt),
          destStream = fs.createWriteStream(
            path.join(destFolderPath, contentsId),
            {
              flags:'wx'
            }
          );

    //  translate for encript
    const encStream = stream.passThrw;
    docInfoCntxt.stream.pipe(encStream).pipe(destStream);

    const contentsWrote = (()=>{
      return new Promise((resolve)=>{
        destStream.on('close', () => {
            resolve();
        });
      });
    })();

    // set contents Information
    if (typeof cntxt.contentsInfo[contentsId] !== 'undefined') {
      throw new Error(`alrady contentsId exist. (${contentsId})`);
    }
    cntxt.contentsInfo[contentsId] = {
      title: docInfoCntxt.title,
      sourcePath: docInfoCntxt.srcPath,
    };
    ccntxt.writeingList.push(contentsWrote);

    return contentsId;
  }

  function regist(ccntxt) {
      const w1 = ccntxt.super.saver.flush();
      
      return Promise.all([w1, ccntxt.writeingList]);
  }

  function client(cntxt, clientID) {
    const ccntxt = {
      super: cntxt,
      clientID,
      writingList: [],
    };

    return {
        add: add.bind(null, ccntxt),
        regist: regist.bind(null, ccntxt),
    };
  }


  return {
    init,
    genDocInfo,
    client
  };
});
