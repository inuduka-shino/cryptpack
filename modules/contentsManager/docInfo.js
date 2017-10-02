/* contentsManager: docInfo.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),
        stream = require('stream');

  return function genDocInfoF(accessSymbl, srcInfo0) {
    // srcInfo = [ type, src, title ]
    // srcはtypeによって決まるなにか
    const srcInfo = (()=>{
        if (!Array.isArray(srcInfo0)) {
          return ['file', srcInfo];
        }
        return srcInfo0;
      })();

    const cntxt = {
      title: srcInfo[2]
    };

    if (srcInfo[0] === 'file') {
      const filepath = srcInfo[1];

      if (typeof srcInfo[2] === 'undefined') {
        cntxt.title = path.basename(filepath);
      }
      cntxt.stream = fs.createReadStream(filepath);
    } else if (srcInfo[0] === 'stream') {
      cntxt.stream = srcInfo[1];
    } else if (srcInfo[0] === 'text') {
      const strm = new stream.Readable();
      strm.push(srcInfo[1]);
      strm.push(null);
      cntxt.stream = strm;
    } else {
      throw new Error(`unknown document information type (${srcInfo[0]})`);
    }

    return {
      [accessSymbl]: cntxt,
      [Symbol.for('debug')]: cntxt,
    };
  };
});
