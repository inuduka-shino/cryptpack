/* cxService.js */
/*eslint-env node */
/*eslint no-console: off */

const crypto=require('crypto');

function getRandSeed() {
    return new Promise((resolve, reject)=>{
      crypto.randomBytes(1024,(err, buff) => {
        if (err) {
          reject(err);
        }
        resolve(
          buff
        );
      });
    });
}

function services(command ,req) {
  if (command==='getRandSeed') {
    return getRandSeed(req);
  }
  throw new Error('unkown command.');
}

module.exports = services;
