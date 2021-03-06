/* base64Util.js */
/*eslint-env browser */
/*global define */
/*eslint no-console: off */

define((require)=>{
  const pCryptico = require('cryptico');

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

    try {
      rsakey.n = regenBigInteger(plainObj.n);
      rsakey.e = plainObj.e;
      rsakey.d = regenBigInteger(plainObj.d);
      rsakey.p = regenBigInteger(plainObj.p);
      rsakey.q = regenBigInteger(plainObj.q);
      rsakey.dmp1 = regenBigInteger(plainObj.dmp1);
      rsakey.dmq1 = regenBigInteger(plainObj.dmq1);
      rsakey.coeff = regenBigInteger(plainObj.coeff);
    } catch (e) {
      console.log('ERROR in regenRSAKey');
      console.log(plainObj);
      throw e;
    }

    return rsakey;
  }

  return {
    regenRSAKey
  };
});
