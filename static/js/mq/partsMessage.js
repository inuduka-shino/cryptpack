/* mq partsMessage.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

// display message parts
// parts(initMessage).set(message)
define((require) => {
  const maquette = require('maquette');
  const h = maquette.h;

  function render(cntx) {
    return h('span', {
      classes: {
        'color-light': cntx.colorClass === 'light',
      }
    }, cntx.message);
  }

  function set(cntx, msg) {
    if (msg === '' || msg === null || typeof msg === 'undefined') {
      cntx.message = cntx.initMessage;
      cntx.colorClass = 'light';
    } else {
      cntx.message = msg;
      cntx.colorClass = 'main';
    }
  }

  function parts(initMessage='ready..') {
    const cntx = {
        initMessage,
        message: initMessage,
        colorClass: 'light',
    };
    return {
      set: set.bind(null, cntx),
      render: render.bind(null, cntx)
    };
  }

  return {
    parts,
  };
});
