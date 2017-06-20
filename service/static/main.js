/*eslint-env browser */
/*eslint no-console: off */
/*global Promise, cryptico */

function checkLoadedDocument() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

const $ = (()=>{
  const id=document.getElementById.bind(document);
  let messageText = '';

  function text($elm, txt) {
    messageText = txt;
    $elm.textContent = messageText;
  }
  function addText($elm, txt) {
    messageText += '  ';
    messageText += txt;
    $elm.textContent = messageText;
  }

  return (idStr) => {
    const $elm = id(idStr);

    return {
      text: text.bind(null, $elm),
      addText: addText.bind(null, $elm),
    };
  };
})();


(async () => {
  await Promise.all([
          checkLoadedDocument(),
        ]);

  console.log('LoadedDoccument');
  const $msg = $('message'),
        $pubKey = $('publicKeyString'),
        $encText = $('encText');

  $msg.text('ready.');
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


})();
