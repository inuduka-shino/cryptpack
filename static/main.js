/*eslint-env browser */
/*eslint no-console: off */
/*global Promise , define, cryptico */

define((require) => {
  const domUtil = require('./domUtil'),
        cryptoTest = require('./cryptoTest'),
        cxMng = require('./cx'),
        base64Util = require('base64Util');

  let theRSAKey = null;

  const cx = cxMng();
  const $ = domUtil.$;

  async function registSecKey() {
    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const clientId = await cx.regPubKey(publicKeyString);

    // db 保管
    theRSAKey = aRSAkey;

    return clientId;
  }
  async function getTestMessage(reqId, testNum) {
    const plaintext = await cx.getTestMessage(reqId, testNum);

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

          return Promise.all([
            getTestMessage(regId, 0),
            getTestMessage(regId, 1),
            getTestMessage(regId, 2)
          ]);
        })
        .then((enctexts)=>{
          const plaintext = enctexts.map((enctext) => {
            const decObj = cryptico.decrypt(enctext, theRSAKey);

            if (decObj.status !== 'success') {
              throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
            }

            return base64Util.decode(decObj.plaintext);
          }).join(':');

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
