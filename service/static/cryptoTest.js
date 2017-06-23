/* cryptoTest.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define, cryptico */

define(() =>{
  //eslint-disable-next-line max-statements
  return function (list$) {
    const $msg = list$.$msg,
          $pubKey = list$.$pubKey,
          $encText = list$.$encText,
          $decText = list$.$decText;

    const typeOfCryptico = typeof cryptico;

    $msg.addText(`cryptico is ${typeOfCryptico}.`);

    const passPhrase ='same word. ex.abcdefg',
          bits = 1024;

    const aRSAkey = cryptico.generateRSAKey(passPhrase, bits);

    $msg.addText(`RSAkey is ${typeof aRSAkey}.`);

    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    $msg.addText('publicKeyString generated.');
    $pubKey.text(publicKeyString);

    const encObj = cryptico.encrypt('abcd efg', publicKeyString);

    if (encObj.status !== 'success') {
      throw new Error(`cryptico.encrypt error!(status=${encObj.status})`);
    }

    const encText = encObj.cipher;

    $encText.text(encText);

    const decObj = cryptico.decrypt(encText, aRSAkey);

    if (decObj.status !== 'success') {
      throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
    }

    $decText.text(decObj.plaintext);
  };
});
