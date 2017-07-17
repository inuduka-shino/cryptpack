/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() => {

  async function save(openPrms, key, value) {
    console.log('save');

    const db = await openPrms;
    const tx = db.transaction(['client'], 'readwrite'),
          store = tx.objectStore('client');

    const req = store.put({
      clientId: key,
      value
    });

    await new Promise((resolve, reject)=>{
      tx.oncomplite = () => {
        console.log('trans cpmplite');
      };
      req.onsuccess = () =>{
        console.log('put success');
        tx.close();
        resolve();
      };
      req.onerror = (err) => {
        console.log(err);
        reject(err);
      };
    });

  }
  async function load(openPrms) {
    console.log('load');
    const db = await openPrms;
  }

  function generate() {
    const version = 1,
          openPrms =new Promise((resolve, reject) =>{
            try {
              const req = window.indexedDB.open('SxClient', version);

              req.onupgradeneeded = () =>{
                console.log('db onupgradeneeded');
                const db = req.result;

                if (db.objectStoreNames.contains('client')) {
                  throw new Error('データ変換ロジックがありません。');
                  //db.deleteObjectStore('client');
                }
                db.createObjectStore('client', {
                  keyPath: 'clientId'
                });
              };
              req.onsuccess = () => {
                  const db = req.result;

                  console.log('db onsuccess');
                  db.onerror=(errEvent) => {
                    console.log(`db error : ${errEvent.target.errorCode}`);
                  };
                  resolve(db);
              };
              req.oncomplite = () => {
                console.log('db onsuccess');
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
