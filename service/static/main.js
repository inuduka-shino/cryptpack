/*eslint-env browser */
/*eslint no-console: off */
/*global Promise , define, cryptico */

define((require) => {
  const domUtil = require('./domUtil'),
        cryptoTest = require('./cryptoTest'),
        cx = require('./cx');

  const $ = domUtil.$;

  async function registSecKey() {
    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const keyId = await cx.regPubKey(publicKeyString);

    // db 保管
    return keyId;
  }
  async function getTestMessage(reqId) {
    const plaintext = await cx.getTestMessage(reqId);

    return plaintext;
  }

  (async () => {
    await Promise.all([
            domUtil.checkLoadedDocument(),
          ]);

    console.log('LoadedDoccument');
    const $msg = $('message');

    function msg(msgtxt) {
      $msg.text(msgtxt);
      console.log(msgtxt);
    }

    msg('ready.');

    const $button= $('cryptoTestButton');

    const dispInfo = {
            $msg,
            $pubKey: $('publicKeyString'),
            $encText: $('encText'),
            $decText: $('decText'),
          },
          $cryptoTest = $('cryptotest');

    $('genRSAKeyButton').on(
      'click',
      () => {
      msg('start gen sec key...');
        registSecKey()
        .then((regId)=>{
          msg('generated sec key !');

          return getTestMessage(regId);
        })
        .then((plaintext)=>{
          msg(`message is [${plaintext}]`);
        });
      }
    );

    $button.on('click',() =>{
      $cryptoTest.removeClass('hide');
      cryptoTest(dispInfo);
    });
  })();
});
