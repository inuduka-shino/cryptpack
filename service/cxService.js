/* cxService.js */
/*eslint-env node */
/*eslint no-console: off */

const crypto=require('crypto');
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

const clientManager = (function () {
  const clientMap = {};

  function registClient(publicKeyString) {
    const clientId = 'ASS001CL001';

    clientMap[clientId] = publicKeyString;

    return clientId;
  }

  return {
    registClient
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

function services(command ,reqVal) {
  if (command==='getRandSeed') {
    return getRandSeed();
  }
  if (command==='regPubKey') {
    return regPubKey(reqVal);
  }
  console.log(`unkown command.[${command}]`);
  console.log(reqVal);
  throw new Error(`unkown command.[${command}]`);
}

module.exports = services;
