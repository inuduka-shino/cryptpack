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
        partsButton = require('../mq/partsButton').parts,
        srvApp = require('./serviceApplication');

  let scheduleRender = null;
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


  pRegButton.onclick(()=>{
    pRegButton.setLabel('登録中...');
    pMessage.set('登録処理開始');
    return srvApp.regSeckey().then(()=>{
      pRegButton.setLabel('登録');
      pMessage.set('登録処理完了');
      scheduleRender();
    });
  });

  pTestButton.onclick(()=>{
    pTestButton.setLabel('処理中...');
    pMessage.set('テストメッセージ取得中');
    return srvApp.getTestMessage().then((msg)=>{
      pTestButton.setLabel('テスト');
      pMessage3.set(msg);
      pMessage.set('テストメッセージ取得完了');
      scheduleRender();
    });
  });


  const bodyClasses = {
    smartphone: false,
  };
  function setEnv(envObj) {
    bodyClasses.smartphone = envObj.smartphone;
    scheduleRender = envObj.scheduleRender;
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
