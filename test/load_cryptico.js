/*eslint-env node, mocha */
/*eslint global-require:0 */
const expect = require('chai').expect;

describe('usage cryptico', () => {
  let cryptico = null,
      aRSAkey = null;

  it('load module',() => {
    cryptico = require('cryptico');
    expect(cryptico).is.a('Object');
    expect(cryptico).has.property('generateRSAKey');
  });

  it('RSAKey生成',(done)=>{
    const passPhrase ='same word. ex.abcdefg',
          bits = 1024;

    aRSAkey = cryptico.generateRSAKey(passPhrase, bits);

    expect(aRSAkey).is.a('Object');

    done();
  }).timeout(20000);

});
