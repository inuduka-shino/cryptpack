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
        pMessage2 = mqCommon.partsMessage(),
        pMessage3 = mqCommon.partsMessage(),
        pMsgCol = partsCol(pMessage, 'xs-12'),
        pMsgCol2 =partsCol(pMessage2, 'xs-6'),
        pMsgCol3 =partsCol(pMessage3, 'xs-6');

  pMessage2.set('abc');
  pMessage3.set('あいう');

  const bodyClasses = {
    smartphone: false,
  };

  function smartphone() {
    bodyClasses.smartphone = true;
  }

  function render() {

    return h('body',
      {
        classes: bodyClasses,
      },
      [
        h('h3', 'クライアント登録'),
        partsRow(pMsgCol),
        partsRow([pMsgCol2,pMsgCol3]),
      ].map((prow, idx)=>{
        if (prow.render) {
          if (prow.key) {
            return prow.key(idx).render();
          }
          return prow.render();
        }
        return prow;
      })
    );
  }

  return {
    smartphone,
    render,
  };
});
