/* contentsManager: docInfo.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const path = require('path'),
        fs = require('fs'),
        stream = require('stream');

  function genIndexContents(contentsInfo, contentsList) {
    return JSON.stringfy({
      contentsList:  contentsList.map((contentsID)=>{
        const contentsInfoSaveImage = contentsInfo[contentsID];
        return [contentsID, contentsInfoSaveImage.title];
      })
    });
  }

  function genDocInfo(srcInfo0) {
    // accessSymbol: token for friendship
    // srcInfo = [ type, src, title ]
    // srcはtypeによって決まるなにか
    const srcInfo = (()=>{
        if (!Array.isArray(srcInfo0)) {
          return ['file', srcInfo0];
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
      strm.setEncoding('utf8');
      strm.push(srcInfo[1], 'utf8');
      strm.push(null);
      cntxt.stream = strm;
    } else {
      throw new Error(`unknown document information type (${srcInfo[0]})`);
    }

    cntxt.saveImage = {
      title: cntxt.title,
    };

    return {
      [Symbol.for('debug')]: cntxt,
      stream: cntxt.stream,
      saveImage: cntxt.saveImage,
    };
  }

  return {
    genIndexContents,
    genDocInfo,
  };
});
