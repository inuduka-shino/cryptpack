/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {

  function generate() {
    const version = 1,
          dbOpenRequest = window.indexedDB.open("RSAClient", version);
    return {
      save,
      load
    };
  }

  return {
    generate
  };
});
