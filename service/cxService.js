/* cxService.js */
/*eslint-env node */
/*eslint no-console: warn */

const cryptico = require('cryptico'),
      logs = require('../modules/logs'),
      randomString = require('../modules/randomString');


const transStrCode = (()=>{
  const utf8 = 'utf8',
        base64 = 'base64';

  function codeTrans(codeA,codeB,str) {
    return (new Buffer(str,codeA)).toString(codeB);
  }

  return {
    strToB64: codeTrans.bind(null, utf8, base64),
    b64ToStr: codeTrans.bind(null, base64, utf8),
  };
})();

const clientManager = (function () {
  const clientMap = {};

  function registClient(publicKeyString) {
    const clientId = 'ASS001CL001';

    clientMap[clientId] = publicKeyString;

    return clientId;
  }

  function getClient(clientId) {
    return {
      publicKeyString () {
        return clientMap[clientId];
      }
    };
  }

  return {
    registClient,
    getClient
  };
}());

function getRandSeed() {
  return randomString.get();
}
function regPubKey(reqVal) {
  const publicKeyString = reqVal.publicKeyString;

  return new Promise((resolve)=>{
    const clientId =clientManager.registClient(publicKeyString);

    resolve(clientId);
  });
}

const testMessage = [
  'abc',
  'def',
  'あいう'
];

function getTestMessage(reqVal) {
  const publicKeyString = clientManager
        .getClient(reqVal.clientId)
        .publicKeyString();

  const plaintext = testMessage[reqVal.testNum];

  return new Promise((resolve, reject)=>{
    const b64PlainText = transStrCode.strToB64(plaintext);
    const encObj = cryptico.encrypt(b64PlainText, publicKeyString);

    if (encObj.status === 'success') {
      resolve(encObj.cipher);

      return;
    }
    reject(new Error(`cryptico encrypt Error: bad status ${encObj.status}`));
  });
}

function services(command ,reqVal) {
  if (command==='getRandSeed') {
    return getRandSeed();
  }
  if (command==='regPubKey') {
    return regPubKey(reqVal);
  }
  if (command==='getTestMessage') {
    return getTestMessage(reqVal);
  }
  logs.log(`unkown command.[${command}]`);
  logs.log(reqVal);
  throw new Error(`unkown command.[${command}]`);
}

module.exports = services;
