/* mqCommon.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

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
  function partsMessage() {
    let message = 'ready..',
       colorClass = 'light';

   function set(msg) {
     if (msg === '' || msg === null || typeof msg === 'undefined') {
       message = 'ready..';
       colorClass = 'light';
     } else {
       message = msg;
       colorClass = 'main';
     }
   }
    function render() {
      return h('span', {
        classes: {
          'color-light': colorClass === 'light',
        }
      }, message);
    }
    return {
      set,
      render
    };

  }


  return {
    partsRow,
    partsCol,
    partsMessage
  };
});
