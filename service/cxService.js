/* cxService.js */
/*eslint-env node */
/*eslint no-console: off */

const crypto=require('crypto'),
      cryptico = require('cryptico');

const transMap = {
  true: {
    alpha:  'A'.charCodeAt(),
    num: '0'.charCodeAt() -26,
    sp: '_'.charCodeAt(),
  },
  false: {
    alpha:  'a'.charCodeAt(),
    num: '5'.charCodeAt() -26,
    sp: '-'.charCodeAt(),
  }
};

function trans(binArray) {
  return binArray.map((code) => {

    /*eslint-disable no-bitwise */
    const ucode = code & 0x1f,
          codeMap = transMap[Boolean(code & 0x20)];

    /*eslint-enable no-bitwise */

    if (ucode < 26) {
      return codeMap.alpha + ucode;
    } else if (ucode < 31) {
      return codeMap.num + ucode;
    } else if (ucode === 31) {
      return codeMap.sp;
    }

    throw new Error('bad mask!');
  });
}

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
    return new Promise((resolve, reject)=>{
      crypto.randomBytes(1024,(err, buff) => {
        if (err) {
          reject(err);
        }
        const binArray = trans(new Uint8Array(buff)),
              seedString = (new Buffer(binArray)).toString();

        resolve(
          seedString
        );
      });
    });
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

  console.log('plaintext');
  console.log(plaintext);

  return new Promise((resolve, reject)=>{
    const b64PlainText = transStrCode.strToB64(plaintext);
    const encObj = cryptico.encrypt(b64PlainText, publicKeyString);

    if (encObj.status === 'success') {
      resolve(encObj.cipher);
      console.log('publicKeyString');
      console.log(publicKeyString);
      console.log('encObj.cipher');
      console.log(encObj.cipher);

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
  console.log(`unkown command.[${command}]`);
  console.log(reqVal);
  throw new Error(`unkown command.[${command}]`);
}

module.exports = services;
