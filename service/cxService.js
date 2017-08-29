/* cxService.js */
/*eslint-env node */
/*eslint no-console: warn */

const cryptico = require('cryptico'),
      config = require('../config'),
      logs = require('../modules/logs'),
      base64Util = require('../modules/base64Util'),
      randomString = require('../modules/randomString'),
      clientManager = require('../modules/clientManager'),
      testMessage = require('../modules/testMessage');

const clientMng = clientManager.generate(config.clientFilePath);

function getRandSeed() {
  return randomString.get();
}

function regPubKey(reqVal) {
  const publicKeyString = reqVal.publicKeyString,
        clientName = reqVal.clientName;

  return clientMng.registClient({
    clientName,
    publicKeyString
  });
}

async function getTestMessage(reqVal) {
  if (typeof reqVal === 'undefined') {
    throw new Error('getTestMessage:undefined argment');
  }
  if (typeof reqVal.clientId === 'undefined') {
    throw new Error('getTestMessage:undefined clientId argment');
  }
  if (typeof reqVal.testNum === 'undefined') {
    throw new Error('getTestMessage:undefined testNum argment');
  }
  const client = await clientMng.getClient(reqVal.clientId);

  const publicKeyString = client.publicKeyString(),
        plaintext = testMessage.get(reqVal.testNum),
        encObj = cryptico.encrypt(base64Util.strToB64(plaintext), publicKeyString);

  if (encObj.status === 'success') {
    return encObj.cipher;
  }
  throw new Error(`cryptico encrypt Error: bad status ${encObj.status}`);
}

async function getIndex(reqVal) {
  await aaa(reqVal);
  return {
    index: '',
    path: '',
  };
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
      if (command==='getIndex') {
        return getIndex(reqVal);
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
