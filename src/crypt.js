/*eslint-env node, mocha */
/* crypt.js */

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

module.exports = {
  transStrCode
};
