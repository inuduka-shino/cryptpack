/* regClient serviceApplication.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const
        pCryptico = require('cryptico'),
        cxMng = require('../cx/cx'),
        //domUtil = require('./domUtil'),
        //cryptoTest = require('./cryptoTest'),
        base64Util = require('../base64Util'),
        clientSaver = require('../clientSaver');

  const cryptico = pCryptico.cryptico;
  const cx = cxMng();
  const clntSvr = clientSaver.generate();

  const userID = 'demo01';
  let theClientID = null;

  async function regSeckey() {
    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const clientId = await cx.regPubKey(userID, publicKeyString);

    // db 保管
    await clntSvr.save(clientId, aRSAkey);
    theClientID = clientId;
  }

  function getTestMessages () {
    const aRSAKeyPrms = clntSvr.load(theClientID);
    const rcvPrmses = [0, 1, 2].map((testId)=> {
      return Promise.all([
          cx.getTestMessage(theClientID, testId),
          aRSAKeyPrms
        ]).then(([enctext, aRSAKey])=>{
        const decObj = cryptico.decrypt(enctext, aRSAKey);

        if (decObj.status !== 'success') {
          throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
        }

        return base64Util.decode(decObj.plaintext);
      });
    });
    return rcvPrmses;
  }

  return {
    regSeckey,
    getTestMessages,
  };
});
