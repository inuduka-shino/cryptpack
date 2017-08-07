/* regClient registSecKey.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {

  const
        pCryptico = require('cryptico'),
        cxMng = require('./cx'),
        //domUtil = require('./domUtil'),
        //cryptoTest = require('./cryptoTest'),
        //base64Util = require('./base64Util'),
        clientSaver = require('../clientSaver');

  //let theClientID = null;

  const cryptico = pCryptico.cryptico;
  const cx = cxMng();
  const clntSvr = clientSaver.generate();

  async function registSecKey (userId) {

    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const clientId = await cx.regPubKey(userId, publicKeyString);

    // db 保管
    //theClientID = clientId;
    await clntSvr.save(clientId, aRSAkey);

    return clientId;
  }

  async function getTestMessage(clientId, testNum) {
    const plaintext = await cx.getTestMessage(clientId, testNum);

    return plaintext;
  }

  return {
    registSecKey,
    getTestMessage,
  };

});
