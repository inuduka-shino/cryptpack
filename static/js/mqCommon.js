/* mqCommon.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

// eslint-disable-next-line max-statements
define((require) => {
  const maquette = require('maquette');

  const h = maquette.h;

  function setKey(cntx, k) {
    cntx.keyid=k;
    return cntx.thisIF;
  }

  function partsRowRender (cntx) {
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

  function partsRow(pCol) {
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
      key: setKey.bind(null,cntx),
      render: partsRowRender.bind(null, cntx),
    };
    return cntx.thisIF;
  }

  function partsColRender(cntx) {
    return h(
      'div',
      {
          key: cntx.keyid,
          class: `col ${cntx.colsize}`
      },
      cntx.pElm.render()
    );
  }

  function partsCol(pElm, colsize) {
    const cntx = {
      keyid: null,
      thisIF: null,
      pElm,
      colsize,
    };

    cntx.thisIF = {
      key: setKey.bind(null,cntx),
      render: partsColRender.bind(null, cntx),
    };
    return cntx.thisIF;
  }

  function partsMessageRender(cntx) {
    return h('span', {
      classes: {
        'color-light': cntx.colorClass === 'light',
      }
    }, cntx.message);
  }

  function partsMessageSet(cntx, msg) {
    if (msg === '' || msg === null || typeof msg === 'undefined') {
      cntx.message = 'ready..';
      cntx.colorClass = 'light';
    } else {
      cntx.message = msg;
      cntx.colorClass = 'main';
    }
  }

  function partsMessage() {
    const cntx = {
        message: 'ready..',
        colorClass: 'light',
    };
    return {
      set: partsMessageSet.bind(null, cntx),
      render: partsMessageRender.bind(null, cntx)
    };
  }

  function callRenderForMap (prow, idx) {
    if (prow.render) {
      if (prow.key) {
        return prow.key(idx).render();
      }
      return prow.render();
    }
    return prow;
  }

  return {
    partsRow,
    partsCol,
    partsMessage,
    callRenderForMap,
  };
});
