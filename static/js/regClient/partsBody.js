/* regClient partsBody.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const maquette = require('maquette'),
        mqUtil = require('../mq/util'),
        partsRow = require('../mq/partsRow').parts,
        partsCol = require('../mq/partsCol').parts,
        partsMessage = require('../mq/partsMessage').parts;

  const h =maquette.h;

  const pMessage = partsMessage(),
        pMessage2 = partsMessage(),
        pMessage3 = partsMessage();

  const bodyChildren = [
      h('h3', 'クライアント登録'),
      partsRow(partsCol(pMessage, 'xs-12')),
      partsRow([
        partsCol(pMessage2, 'xs-6'),
        partsCol(pMessage3, 'xs-6'),
      ]),
    ];


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
      bodyChildren.map(mqUtil.callRenderForArray)
    );
  }

  return {
    smartphone,
    render,
  };
});
