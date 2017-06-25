/*eslint-env browser */
/*eslint no-console: off */
/*global Promise , define */

define(['domUtil','cryptoTest'], (domUtil, cryptoTest) => {
  (async () => {
    const $ = domUtil.$;

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
      fetch('./cx/getRandSeed').then((res) => {
        return res.json();
      })
      .then((data)=>{
        msg(`fetch ./cx/:${data.status}`);
      });
    });

    $button.on('click',() =>{
      $cryptoTest.removeClass('hide');
      cryptoTest(dispInfo);
    });
  })();
});
