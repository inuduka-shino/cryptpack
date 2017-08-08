/* mq partsCol.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

// div.col in div.row for skyblue
// parts(pElm, colsize)
define((require) => {
  const maquette = require('maquette'),
        util = require('./util');
  const h = maquette.h;

  function render(cntx) {
    return h(
      'div',
      {
          key: cntx.keyid,
          class: `col ${cntx.colsize}`
      },
      cntx.pElm.render()
    );
  }

  function parts(pElm, colsize='xs-12') {
    const cntx = {
      keyid: null,
      thisIF: null,
      pElm,
      colsize,
    };

    cntx.thisIF = {
      key: util.setKey.bind(null,cntx),
      render: render.bind(null, cntx),
    };
    return cntx.thisIF;
  }

  return {
    parts,
  };
});
