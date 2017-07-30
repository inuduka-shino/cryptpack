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

  const key1 = mqCommon.generateKey();
  for (let i=0; i < 3; i+=1) {
    const a=key1();
    const key2 = mqCommon.generateKey();
    for (let j=0; j <4; j+=1) {
      const b=key2();
      console.log(`a=${a} b=${b}`);
    }
  }

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
