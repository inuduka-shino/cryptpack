/* regClient partsBody.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

//eslint-disable-next-line max-statements
define((require)=>{
  const maquette = require('maquette'),
        mqUtil = require('../mq/util'),
        partsRow = require('../mq/partsRow').parts,
        partsCol = require('../mq/partsCol').parts,
        partsMessage = require('../mq/partsMessage').parts,
        partsButton = require('../mq/partsButton').parts;

  let projector = null;
  const h =maquette.h;

  const pMessage = partsMessage(),
        pRegButton = partsButton(),
        pTestButton = partsButton(),
        pMessage2 = partsMessage(),
        pMessage3 = partsMessage();

  const bodyChildren = [
      h('h3', 'クライアント登録'),
      partsRow(partsCol(pMessage)),
      partsRow([partsCol(pRegButton.setLabel('登録'))]),
      partsRow([partsCol(pTestButton.setLabel('テスト'))]),
      partsRow([
        partsCol(pMessage2, 'xs-6'),
        partsCol(pMessage3, 'xs-6'),
      ]),
    ];

  let regButtonResolve = null;
  pRegButton.onclick(()=>{
    return new Promise((resolve)=>{
      regButtonResolve = resolve;
      pRegButton.setLabel('登録中...');
      pMessage.set('登録処理開始');
    }).then(()=>{
      pRegButton.setLabel('登録');
      pMessage.set('登録処理完了');
    });
  });

  pTestButton.onclick(()=>{
    regButtonResolve();
  });

  pMessage3.set('あいう');

  const bodyClasses = {
    smartphone: false,
  };

  function setEnv(envObj) {
    bodyClasses.smartphone = envObj.smartphone;
    projector = envObj.projector;
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
    setEnv,
    render,
  };
});
