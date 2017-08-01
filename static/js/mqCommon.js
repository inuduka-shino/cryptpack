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


  function partsCol(pElm, colsize) {
    let keyid=null,
          thisIF=null;

    function key(k) {
      keyid = k;
      return thisIF;
    }
    function render() {
      return h(
        'div',
        {
            key: keyid,
            class: `col ${colsize}`
        },
        pElm.render()
      );
    }

    thisIF = {
      key,
      render
    };
    return thisIF;
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
