/* base64Util.js */
/*eslint-env browser */
/*global define */
/*eslint no-console: off */

define(()=>{
  //const encoder = new TextEncoder('utf8'),
  //      decoder = new TextDecoder('utf8');

  function encode(str) {
      // バイナリイメージでbtoaにかける
      const binUi8a = unescape(encodeURIComponent(str));

      return btoa(binUi8a);
  }
  function decode(base64str) {
    const binStr = atob(base64str);

    return decodeURIComponent(escape(binStr));

  }

  return {
    encode,
    decode
  };
});
