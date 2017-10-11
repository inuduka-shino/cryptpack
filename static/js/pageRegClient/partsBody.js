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
        pErrorMessage = partsMessage();

  const bodyChildren = [
      h('h3', 'クライアント登録'),
      partsRow(partsCol(pMessage)),
      partsRow([partsCol(pRegButton.setLabel('登録'))]),
      partsRow([partsCol(pTestButton.setLabel('テスト'))]),
      partsRow([
        partsCol(pMessage2),
        partsCol(pErrorMessage),
      ]),
    ];


  pRegButton.onclick(()=>{
    pRegButton.setLabel('登録中...');
    pMessage.set('登録処理開始');
    return srvApp.regSeckey().then(
      ()=>{
        pMessage.set('登録処理完了');
      },
      (err)=>{
        pMessage.set('登録処理失敗');
        pErrorMessage.set(err.message);
      }
    ).then(()=>{
      pRegButton.setLabel('登録');
      scheduleRender();
    });
  });

  pTestButton.onclick(()=>{
    pTestButton.setLabel('処理中...');
    pMessage.set('テストメッセージ取得中');
    const msgPrmses = srvApp.getTestMessages(),
          messages = ['','',''];
    msgPrmses.forEach((msgPrms, idx)=>{
      msgPrms.then((msg)=>{
        messages[idx] = msg;
        pMessage2.set(messages.join(':'));
        scheduleRender();
      });
    });
    return Promise.all(msgPrmses).then(()=>{
      pMessage.set('テストメッセージ取得完了');
    }, (err) => {
      pMessage.set('テストメッセージ取得失敗');
      pErrorMessage.set(err.message);
    }).then(()=>{
      pTestButton.setLabel('テスト');
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
