/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {
  const crypticoUtil = require('./crypticoUtil');
  const
    osnNames = ['n001', 'n002'],
    osnRSAKey = osnNames[0],
    osnUserInfo = osnNames[1],
    dbSchema = {
    version: 7,
    newSchema(db) {
      console.log(`change indexedDB objectStore:ver ${this.version}`);
      db.createObjectStore(osnRSAKey, {
        keyPath: 'clientId'
      });
      db.createObjectStore(osnUserInfo, {
        keyPath: 'userId'
      });
    },
    translate(db) {
      // throw new Error('データ変換ロジックがありません。');
      db.deleteObjectStore(osnRSAKey);
      try {
        db.deleteObjectStore(osnUserInfo);
      } catch (e) {
        console.log('no userInfo db');
      }
      console.log('delete all indexedDB objectStore');
    }
  };

  function dbOpen(version) {

    return new Promise((resolve, reject) =>{
      try {
        const req = window.indexedDB.open('SxClient', version);

        req.onupgradeneeded = () =>{
          const db = req.result;

          if (db.objectStoreNames.contains(osnRSAKey)) {
            dbSchema.translate(db);
          }
          dbSchema.newSchema(db);
        };
        req.onsuccess = () => {
            const db = req.result;

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
  }

  //let theRSAKey=null;

  async function save(osnName, key, value) {
    console.log('save');

    const db = await dbOpen(dbSchema.version);
    const tx = db.transaction(osnNames, 'readwrite'),
          store = tx.objectStore(osnName);
    const req = store.put({
      clientId: key,
      value
    });

    tx.oncomplite = () => {
      console.log('indexedDB save trans complite');
    };

    await new Promise((resolve, reject)=>{
      req.onsuccess = () =>{
        db.close();
        resolve();
      };
      req.onerror = (err) => {
        console.log(err);
        reject(err);
      };
    });

  }

  async function load(osnName, key) {
    console.log('load');
    const db = await dbOpen(dbSchema.version);
    const tx = db.transaction(osnNames, 'readwrite'),
          store = tx.objectStore(osnName);
    const req = store.get(key);
    const ret = await new Promise((resolve, reject)=>{
      req.onsuccess = () =>{
        db.close();
        resolve(crypticoUtil.regenRSAKey(req.result.value));
      };
      req.onerror = (err) => {
        console.log(err);
        reject(err);
      };
    });

    return ret;
  }

function generate() {
    return {
      save: save.bind(null, osnRSAKey),
      load: load.bind(null, osnRSAKey),
    };
  }

  return {
    generate
  };
});
