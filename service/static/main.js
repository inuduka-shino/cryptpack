/*eslint-env browser */
/*eslint no-console: off */
/*global Promise , define */

define((require) => {
  const domUtil = require('./domUtil'),
        cryptoTest = require('./cryptoTest'),
        cx = require('./cx');

  const $ = domUtil.$;

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

    $('genRSAKeyButton').on('click',() =>{
      cx.getRandSeed()
        .then((seed)=>{
          msg('fetch ./cx/:ok');
          console.log(seed);
        });
    });

    $button.on('click',() =>{
      $cryptoTest.removeClass('hide');
      cryptoTest(dispInfo);
    });
  })();
});
