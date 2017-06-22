/*eslint-env browser */
/*eslint no-console: off */
/*global Promise, mdls */

mdls('Main', async (mdls)=>{
    const $ = mdls.domUtil.$;

    await Promise.all([
            mdls.domUtil.checkLoadedDocument(),
          ]);

    console.log('LoadedDoccument');
    const $msg = $('message');

    $msg.text('ready.');
    const $button= $('cryptoTestButton');

    const dispInfo = {
            $msg,
            $pubKey: $('publicKeyString'),
            $encText: $('encText'),
            $decText: $('decText'),
          },
          $cryptoTest = $('cryptotest');

    $button.on('click',() =>{
      $cryptoTest.removeClass('hide');
      mdls.cryptoTest(dispInfo);
    });
});
