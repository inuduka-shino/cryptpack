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

  function text(self, txt) {
    self.text = txt;
    self.$.textContent = self.text;
  }
  function addText(self, txt) {
    self.text += txt;
    self.$.textContent = self.text;
  }
  function addClass(self, className) {
    self.$.classList.add(className);
  }
  function removeClass(self, className) {
    self.$.classList.remove(className);
  }
  function on(self, eventName, eventHandler) {
    self.$.addEventListener(eventName, eventHandler);
  }

  return (idStr) => {
    const domInfo = {
      $: id(idStr),
      text: null,
    };

    return {
      text: text.bind(null, domInfo),
      addText: addText.bind(null, domInfo),
      addClass: addClass.bind(null, domInfo),
      removeClass: removeClass.bind(null, domInfo),
      on: on.bind(null, domInfo),
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
        $encText = $('encText'),
        $decText = $('decText');

  $msg.text('ready.');
  const $button= $('cryptoTestButton');

  $button.on('click',() => {
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
  });
})();
