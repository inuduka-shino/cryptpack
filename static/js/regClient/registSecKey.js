/* regClient registSecKey.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {

  async function registSecKey () {

    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const clientId = await cx.regPubKey('demo01', publicKeyString);

    // db 保管
    //theClientID = clientId;
    await clntSvr.save(clientId, aRSAkey);

    return clientId;

  }

  async function getTestMessage(reqId, testNum) {
    const plaintext = await cx.getTestMessage(reqId, testNum);

    return plaintext;
  }

  return {
    registSecKey,
    getTestMessage,
  };

});
