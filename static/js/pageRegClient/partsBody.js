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
        pErrorMessage = partsMessage();


  function message(msg) {
    pMessage.set(msg);
  }
  function errorMessage(msg) {
    pErrorMessage.set(msg);
  }
  function anyAction() {
    message('');
    errorMessage('');
  }

  // ユーザ登録
  pRegButton.setLabel('登録');
  pRegButton.onclick(async ()=>{
    anyAction();
    pRegButton.setLabel('登録中...');
    message('登録処理開始');
    await srvApp.regSeckey().then(
              ()=>{
              message('登録処理完了');
            },
            (err)=>{
              message('登録処理失敗');
              errorMessage(err.message);
            }
          );
    pRegButton.setLabel('登録');
    scheduleRender();
  });

  // テストメッセージ取得
  const pTestButton = partsButton(),
        pTestButtonMessage = partsMessage();
  pTestButton.setLabel('テスト');
  pTestButton.onclick(async ()=>{
    anyAction();
    pTestButton.setLabel('処理中...');
    message('テストメッセージ取得中');

    const msgPrmses = srvApp.getTestMessages(),
          messages = ['','',''];
    msgPrmses.forEach((msgPrms, idx)=>{
      msgPrms.then((msg)=>{
        messages[idx] = msg;
        pTestButtonMessage.set(messages.join(':'));
        scheduleRender();
      });
    });

    await Promise.all(msgPrmses).then(()=>{
            message('テストメッセージ取得完了');
          }, (err) => {
            message('テストメッセージ取得失敗');
            errorMessage(err.message);
          });

    pTestButton.setLabel('テスト');
    scheduleRender();
  });

  return (()=>{
    const bodyChildren = [
        h('h3', 'クライアント登録'),
        //メッセージ
        partsRow(partsCol(pMessage)),
        partsRow(partsCol(pErrorMessage)),
        // ユーザ表示・選択
        // .....
        // テストボタン
        partsRow([
          partsCol(pTestButton, 'xs-2'),
          partsCol(pTestButtonMessage, 'xs-10'),
        ]),
        // ユーザ登録ボタン
        partsRow([partsCol(pRegButton)]),
      ];
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
  })();
});
