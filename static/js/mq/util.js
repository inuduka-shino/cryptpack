/* mq util.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() => {

  function setKey(cntx, k) {
    cntx.keyid=k;
    return cntx.thisIF;
  }

  function callRenderForMap (prow, idx) {
    if (prow.render) {
      if (prow.key) {
        return prow.key(idx).render();
      }
      return prow.render();
    }
    return prow;
  }

  return {
    setKey,
    callRenderForMap,
  };
});
