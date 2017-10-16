/* error.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


/*eslint-disable */
if (typeof define === 'undefined') {
  define = function (func) {
    module.exports = func(require);
  }
}
/*eslint-enable */

define(() => {
  const mmbCode = Symbol('member name for ErrorCode'),
        mmbError = Symbol('member name for orginal Error');

  const nocode= 'NOCODE',
        codeTable = {
          [nocode]: 'no ErrorCode error',
        };

  class CError extends Error {
    constructor (code0, msg0=null, err0=null) {
      let code = null,
          msg = null;
      if (msg0 === null) {
       code = nocode;
       msg = code0;
     } else {
       code = code0;
       msg = `(${code0}):${msg0}`;
     }
     super(msg);
     if (typeof codeTable[code] === 'undefined') {
       codeTable[code] = 'dynamic define Error';
     }
     this.name = 'CError';
     this[mmbCode] = code;
     this[mmbError] = err0;
    }
  }
  function isError(err, code) {
    if (typeof codeTable[code] === 'undefined') {
      throw new Error(`code(${code}) do not use.`);
    }
    return err[mmbCode] === code;
  }
  function getOriginalError(err) {
    return err[mmbError];
  }
  function registCode(code, description='no description') {
    if (typeof codeTable[code] !== 'undefined') {
      throw new Error(`can not regist error code. alrady code(${code}) exist.`);
    }
    codeTable[code] = description;
    return code;
  }
  function description(code) {
    const desc = codeTable[code];
    if (typeof desc === 'undefined') {
      throw new Error(`unkown Error code(${code})`);
    }
    return desc;
  }
  return {
    CError,
    isError,
    getOriginalError,
    // 以下、使う必要なし
    registCode,
    description,
  };
});
