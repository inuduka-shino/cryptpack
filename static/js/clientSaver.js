/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require) => {
  const crypticoUtil = require('./crypticoUtil');
  const
    osnNames = ['n001', 'n002', 'n003'],
    osnRSAKey = osnNames[0],
    osnUserInfo = osnNames[1],
    osnEnv = osnNames[2],
    dbSchema = {
      version: 10,
      schema: {
        [osnRSAKey]: {
          keyPath: 'clientId'
        },
        [osnUserInfo]: {
          keyPath: 'userId'
        },
        [osnEnv]: {
          keyPath: 'key'
        },
      } ,
      developMode: true,
      createObjectStore(db, osnName) {
        console.log(`create indexedDB objectStore[${osnName}] for ver ${dbSchema.version}`);
        db.createObjectStore(
          osnName,
          dbSchema.schema[osnName]
        );
      },
      translateObjectStore(db, osnName) {
        // 存在が前提
        if (dbSchema.developMode) {
          console.log(`delete indexedDB objectStore[${osnName}] for ver ${dbSchema.version}`);
          db.deleteObjectStore(osnName);
          dbSchema.createObjectStore(db, osnName);
        }
      }
  };

  function dbOpen(version) {

    return new Promise((resolve, reject) =>{
      try {
        const req = window.indexedDB.open('SxClient', version);

        req.onupgradeneeded = () =>{
          const db = req.result;

          osnNames.forEach((osnName)=>{
            if (db.objectStoreNames.contains(osnName)) {
              dbSchema.translateObjectStore(db, osnName);
            } else {
              dbSchema.createObjectStore(db, osnName);
            }
          });
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
      [dbSchema.schema[osnName].keyPath]: key,
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
      saveRSAKey: save.bind(null, osnRSAKey),
      loadRSAKey: load.bind(null, osnRSAKey),
      saveUserInfo: save.bind(null, osnUserInfo),
      loadUserInfo: load.bind(null, osnUserInfo),
      saveEnv: save.bind(null, osnEnv),
      loadEnv: load.bind(null, osnEnv),
    };
  }

  return {
    generate
  };
});
