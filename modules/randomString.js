/* randam_string.js */
/*eslint-env node */

const crypto=require('crypto');

module.exports = (()=>{
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

  function getRandomString(len=1024) {

    return new Promise((resolve, reject)=>{
      crypto.randomBytes(len, (err, buff) => {
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

  return {
    get: getRandomString
  };
})();
