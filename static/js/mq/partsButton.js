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
      cntx.properties,
      cntx.label
    );
  }
  function onclick(cntx, handler) {
    cntx.handler = handler;
  }
  function parts() {
    const cntx = {
      label: 'push',
      properties: {
        style: 'margin-top: 7px;',
        classes: {
          'btn': true,
          'btn-sm': true,
          'btn-empty': false,
        },
        handler: null,
        onclick () {
          let ret=null;

          event.preventDefault();
          if (cntx.handler) {
            ret = cntx.handler();
          }
          cntx.properties.classes['btn-empty'] = true;
          if (ret && ret.then) {
            ret.then(() => {
              cntx.properties.classes['btn-empty'] = false;
            });
          }

        }
      }
    };

    return {
      onclick:  onclick.bind(null,cntx),
      render:   render.bind(null,cntx),
    };
  }

  return {
    parts,
  };
});
