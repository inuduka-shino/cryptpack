/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {

  function save(openPrms) {

  }
  function load(openPrms) {

  }

  function generate() {
    const version = 1,
          openPrms =new Promise((resolve, reject) =>{
            try {
              const req = window.indexedDB.open("RSAClient", version);
              req.onsuccess = () => {
                  resolve(req.result);
              };
              req.onerror = () => {
                  reject(new Error(`indexedDB open error. \n${req.error}`));
              };
            } catch (err) {
              reject(err);
            }
          });

    return {
      save: save.bind(null, openPrms),
      load: load.bind(null, openPrms),
    };
  }

  return {
    generate
  };
});
