/* mq partsButton.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


// button
// parts(msg).onclick(handler)
define((require) => {
  const maquette = require('maquette');
  const h = maquette.h;

  function render(cntx) {
    return h(
      'button',
      {
        style: 'margin-top: 7px;',
        classes: {
          'btn': true,
          'btn-sm': true,
          'btn-light': cntx.light,
        },
        onclick: cntx.onclickButton
      },
      cntx.label
    );
  }

  function onclickButton(cntx, event) {
    let ret=null;
    event.preventDefault();
    if (cntx.clickHandler) {
      ret = cntx.clickHandler();
    }
    cntx.light = true;
    if (ret !== null && typeof ret !== 'undefined') {
      if (ret.then) {
        ret.then(() => {
          cntx.light = false;
        });
      }
    } else {
      cntx.lisht = false;
    }
  }
  function onclick(cntx, handler) {
    cntx.clickHandler = handler;
  }

  function parts() {
    const cntx = {
      label: 'push',
      light: false,
      handler: null,
    };
    cntx.onclickButton = onclickButton.bind(null, cntx);

    return {
      onclick:  onclick.bind(null,cntx),
      render:   render.bind(null,cntx),
    };
  }

  return {
    parts,
  };
});
