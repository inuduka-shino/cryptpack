/* mqCommon.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {
  function key(cntx) {
    const ret = cntx.counter;
    cntx.counter += 1;
    return ret;
  }
  function generateKey() {
    return key.bind(null, {
      counter: 0
    });
  }

  return {
    generateKey
  };
});
