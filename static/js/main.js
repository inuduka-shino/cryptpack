/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {
  const
        pCryptico = require('cryptico'),
        domUtil = require('./domUtil'),
        cryptoTest = require('./cryptoTest'),
        cxMng = require('./cx'),
        base64Util = require('./base64Util'),
        clientSaver = require('./clientSaver');

  //let theClientID = null;

  const cryptico = pCryptico.cryptico;
  const cx = cxMng();
  const $ = domUtil.$;
  const clntSvr = clientSaver.generate();


  async function registSecKey() {
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

  //eslint-disable-next-line max-statements
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

    let regId=null;

    $('genRSAKeyButton').on(
      'click',
      () => {
        msg('start gen sec key...');
        registSecKey()
        .then((regId0)=>{
          regId = regId0;
          msg('generated sec key !');
        });
      }
    );

    $('getTestMessage').on(
      'click',
      () => {
        const aRSAKeyPrms = clntSvr.load(regId);
        const rcvPrmses = [
          getTestMessage(regId, 0),
          getTestMessage(regId, 1),
          getTestMessage(regId, 2)
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

        Promise.all(rcvPrmses).then((msgList)=>{
          const msgtxt = msgList.join(':');

          msg(`message is [${msgtxt}]`);
        });
      }
    );

    $button.on('click',() =>{
      $cryptoTest.removeClass('hide');
      cryptoTest(dispInfo);
    });
  })();
});
