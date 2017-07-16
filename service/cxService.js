/* cxService.js */
/*eslint-env node */
/*eslint no-console: warn */

const cryptico = require('cryptico'),
      logs = require('../modules/logs'),
      base64Util = require('../modules/base64Util'),
      randomString = require('../modules/randomString'),
      clientManager = require('../modules/clientManager'),
      testMessage = require('../modules/testMessage');

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

function getTestMessage(reqVal) {
  const publicKeyString = clientManager
        .getClient(reqVal.clientId)
        .publicKeyString();

  const plaintext = testMessage.get(reqVal.testNum);

  return new Promise((resolve, reject)=>{
    const b64PlainText = base64Util.strToB64(plaintext);
    const encObj = cryptico.encrypt(b64PlainText, publicKeyString);

    if (encObj.status === 'success') {
      resolve(encObj.cipher);

      return;
    }
    reject(new Error(`cryptico encrypt Error: bad status ${encObj.status}`));
  });
}

function services(command ,reqVal) {
  return (() => {
    try {
      if (command==='getRandSeed') {
        return getRandSeed();
      }
      if (command==='regPubKey') {
        return regPubKey(reqVal);
      }
      if (command==='getTestMessage') {
        return getTestMessage(reqVal);
      }
      throw new Error(`unkown command.[${command}]`);
    } catch (err) {
        return Promise.reject(err);
    }
  })().catch((err)=> {
    logs.log(`cx command error (${command})`);
    logs.log(err.message);
    logs.log(reqVal);
    logs.log(err.stack);
    throw err;
  });
}

module.exports = services;
