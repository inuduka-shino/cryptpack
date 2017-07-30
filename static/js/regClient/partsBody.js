/* regClient partsBody.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const maquette = require('maquette'),
        mqCommon = require('../mqCommon');

  const h =maquette.h,
        partsRow = mqCommon.partsRow,
        partsCol = mqCommon.partsCol;

  const pMessage = mqCommon.partsMessage(),
        pMsgCol = partsCol(pMessage, 'xs-12');

  function render() {
    const key = mqCommon.generateKey();

    return h('body',[
      h('h3', 'クライアント登録'),
      partsRow(pMsgCol).key(key()).render(),
    ]);
  }

  return {
    render
  };
});
