/* testsb.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


define((require)=>{
  const maquette = require('maquette'),
        domUtil = require('domUtil');

  const h=maquette.h,
        projector=maquette.createProjector();

  function renderMaquette() {
    return h('body', [
      h('h1', 'title'),
      h('p', h('button', {
        class: 'btn'
      }, 'push')),
      h('p', h('input')),
    ]);
  }
  domUtil.checkLoadedDocument().then(
    () => {
      //domUtil.bodyClear();
      projector.replace(
        document.body,
        renderMaquette
      );
    }
  );

});
