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

  async function getTestMessage () {
    /*
    const aRSAKeyPrms = clntSvr.load(theClientID);
    const rcvPrmses = [
      getTestMessage(theClientID, 0),
      getTestMessage(theClientID, 1),
      getTestMessage(theClientID, 2)
    ].map((msgPrms)=> {
      return Promise.all(
        [msgPrms, aRSAKeyPrms]
      ).then(([enctext, aRSAKey])=>{
        const decObj = cryptico.decrypt(enctext, aRSAKey);

        if (decObj.status !== 'success') {
          throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
        }

        return base64Util.decode(decObj.plaintext);
      });
    });
    const msgs = await rcvPrmses;
    return msgs.join(':');
    */
    return 'aaa';
  }

  return {
    regSeckey,
    getTestMessage,
  };
});
