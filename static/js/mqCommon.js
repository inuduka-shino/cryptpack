/* mqCommon.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {
  const maquette = require('maquette');

  const h = maquette.h;

  function key(cntx) {
    const ret = cntx.counter;
    cntx.counter += 1;
    return ret;
  }
  function generateKey() {
    return key.bind(null, {
      counter: 0
    });
  }

  function partsRow(pCol) {
    let keyid= null,
        thisIF=null,
        pColes=null;

    if (Array.isArray(pCol)) {
      pColes=pCol;
    } else {
      pColes=[pCol];
    }
    function key(k) {
      keyid=k;
      return thisIF;
    }
    function render () {
      return h('div',
        {
          key: keyid,
          class:'row'
        },
        pColes.map((pCol,idx)=>{
          return pCol.key(idx).render();
        })
      );
    }
    thisIF = {
      key,
      render,
    };
    return thisIF;

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
    generateKey,
    partsRow,
    partsCol,
    partsMessage
  };
});
