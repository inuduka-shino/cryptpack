/* mq partsButton.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


// button
// pbutton = parts(label).onclick(handler)
// pbutton.setLabel(label)
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
    if (ret === null || typeof ret === 'undefined') {
      return;
    }
    if (ret instanceof Promise) {
      cntx.light = true;
      ret.then(() => {
        cntx.light = false;
      });
    }
  }
  function onclick(cntx, handler) {
    cntx.clickHandler = handler;
    return cntx.thisIF;
  }
  function setLabel(cntx, label) {
    cntx.label = label;
    return cntx.thisIF;
  }

  function parts() {
    const cntx = {
      label: 'push',
      light: false,
      handler: null,

      onclickButton: null,
      thisIF: null
    };

    cntx.onclickButton = onclickButton.bind(null, cntx);
    cntx.thisIF = {
      setLabel:  setLabel.bind(null,cntx),
      onclick:  onclick.bind(null,cntx),
      render:   render.bind(null,cntx),
    };

    return cntx.thisIF;
  }

  return {
    parts,
  };
});
