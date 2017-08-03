/* mq partsRow.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


// div.row  for skyblue
// parts(pCol) or parts([pCol])
define((require) => {
  const maquette = require('maquette'),
        util = require('./util');
  const h = maquette.h;

  function render (cntx) {
    return h('div',
      {
        key: cntx.keyid,
        class:'row'
      },
      cntx.pColes.map((pCol,idx)=>{
        return pCol.key(idx).render();
      })
    );
  }

  function parts(pCol) {
    const cntx= {
      thisIF: null,
      keyid:  null,
      pColes: null,
    };

    if (Array.isArray(pCol)) {
      cntx.pColes=pCol;
    } else {
      cntx.pColes=[pCol];
    }
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
