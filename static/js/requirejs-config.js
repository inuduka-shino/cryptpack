/* domUtil.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global require */

require.config({
  paths: {
    'cryptico': ['/lib/cryptico.min']
  },
  shim: {
    'cryptico': {
          exports: 'pCryptico',
          init() {
            this.pCryptico = {

              /*eslint-disable no-undef*/
              cryptico,
              RSAKey,
              BigInteger

              /*eslint-enable no-undef*/
            };
          }
    }
  }
});
