/* testsb.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


define((require)=>{
  const maquette = require('maquette');

  const h=maquette.h,
        projector=maquette.createProjector();

  function renderTest() {
    return h('h1', 'title');
  }
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      projector.append(
        document.body,
        renderTest
      );
    }
  );

});
