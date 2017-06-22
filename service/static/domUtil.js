/* domUtil.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global mdls */

mdls('domUtil',()=>{
  function checkLoadedDocument() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }


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

  const $ = (()=>{
    const id=document.getElementById.bind(document);

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


  return {
    $,
    checkLoadedDocument
  };
});
