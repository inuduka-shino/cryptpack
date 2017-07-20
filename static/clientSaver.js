/* clientSaver.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() => {
  //const cryptico = require('cryptico');
  const pCryptico = {
    RSAKey, //eslint-disable-line no-undef
    BigInteger //eslint-disable-line no-undef
  };
  const
    osnNames = ['n001'],
    osnRSAKey = osnNames[0],
    dbSchema = {
    version: 6,
    newSchema(db) {
      console.log(`change indexedDB objectStore:ver ${this.version}`);
      db.createObjectStore(osnRSAKey, {
        keyPath: 'clientId'
      });

      /*
      db.createObjectStore('uinfo', {
        keyPath: 'userId'
      });
      */
    },
    translate(db) {
      // throw new Error('データ変換ロジックがありません。');
      db.deleteObjectStore(osnRSAKey);
      //db.deleteObjectStore('uinfo');
      console.log('delete indexedDB objectStore');
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

  async function save(key, value) {
    console.log('save');

    const db = await dbOpen(dbSchema.version);
    const tx = db.transaction(osnNames, 'readwrite'),
          store = tx.objectStore(osnRSAKey);
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

  function regenBigInteger(plainObj) {
    const bigInt = Object.create(pCryptico.BigInteger.prototype);

    for (let i = plainObj.t - 1; i >= 0; i -= 1) {
      bigInt[i] = plainObj[i];
    }
    bigInt.t = plainObj.t;
    bigInt.s = plainObj.s;

    return bigInt;
  }

  function regenRSAKey(plainObj) {
    const rsakey = Object.create(pCryptico.RSAKey.prototype);

    rsakey.n = regenBigInteger(plainObj.n);
    rsakey.e = plainObj.e;
    rsakey.d = regenBigInteger(plainObj.d);
    rsakey.p = regenBigInteger(plainObj.p);
    rsakey.q = regenBigInteger(plainObj.q);
    rsakey.dmp1 = regenBigInteger(plainObj.dmp1);
    rsakey.dmq1 = regenBigInteger(plainObj.dmq1);
    rsakey.coeff = regenBigInteger(plainObj.coeff);

    return rsakey;
  }
  async function load(key) {
    console.log('load');
    const db = await dbOpen(dbSchema.version);
    const tx = db.transaction(osnNames, 'readwrite'),
          store = tx.objectStore(osnRSAKey);
    const req = store.get(key);
    const ret = await new Promise((resolve, reject)=>{
      req.onsuccess = () =>{
        db.close();
        resolve(regenRSAKey(req.result.value));
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
      save: save.bind(null),
      load: load.bind(null),
    };
  }

  return {
    generate
  };
});
