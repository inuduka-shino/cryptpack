/* regClient partsBody.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const maquette = require('maquette'),
        mqUtil = require('../mq/util'),
        partsRow = require('../mq/partsRow').parts,
        partsCol = require('../mq/partsCol').parts,
        partsMessage = require('../mq/partsMessage').parts,
        partsButton = require('../mq/partsButton').parts;

  const h =maquette.h;

  const pMessage = partsMessage(),
        pRegButton = partsButton(),
        pMessage2 = partsMessage(),
        pMessage3 = partsMessage();

  const bodyChildren = [
      h('h3', 'クライアント登録'),
      partsRow(partsCol(pMessage)),
      partsRow([partsCol(pRegButton.setLabel('登録'))]),
      partsRow([
        partsCol(pMessage2, 'xs-6'),
        partsCol(pMessage3, 'xs-6'),
      ]),
    ];

  pRegButton.onclick(()=>{
    return new Promise(()=>{
      pRegButton.setLabel('登録中...');
      pMessage.set('登録処理開始');
    }).then(()=>{
      pRegButton.setLabel('登録');
      pMessage.set('登録処理完了');
    });
  });
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
      bodyChildren.map(mqUtil.callRenderForArray)
    );
  }

  return {
    smartphone,
    render,
  };
});
