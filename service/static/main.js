/*eslint-env browser */
/*eslint no-console: off */
/*global Promise */

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

  function text($elm, txt) {
    $elm.textContent = txt;
  }

  return (idStr) => {
    const $elm = id(idStr);

    return {
      text: text.bind(null, $elm)
    };
  };
})();


(async () => {
  await Promise.all([
          checkLoadedDocument(),
        ]);

  console.log('LoadedDoccument');
  const $msg = $('message');
  const typeOfCryptico = typeof cryptico;

  $msg.text(`cryptico is ${typeOfCryptico}`);
})();
