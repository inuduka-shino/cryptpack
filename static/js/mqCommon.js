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
    let keyid= null;
    function key(k) {
      keyid=k;
    }
    function render () {
      return h('div',{
        key: keyid,
        class:'row'
      },
      [pCol.render()]);
    }
    return {
      key,
      render,
    };

  }
  function partsCol() {

  }


  return {
    generateKey,
    partsRow,
    partsCol
  };
});
