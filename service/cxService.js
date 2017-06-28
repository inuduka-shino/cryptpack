/* cxService.js */
/*eslint-env node */
/*eslint no-console: off */


function getRandSeed(req) {
    console.log(req.body);

    return {
      seed: 'test'
    };
}

function services(command ,req) {
  if (command==='getRandSeed') {
    return getRandSeed(req);
  }
  throw new Error('unkown command.');
}

module.exports = services;
