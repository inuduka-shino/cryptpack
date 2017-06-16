/*eslint-env node, mocha */
/*eslint global-require:0 */
const expect = require('chai').expect;
// ref: http://blog.verygoodtown.com/2011/09/generating-an-rsa-key-pair-public-key-string/

describe('usage cryptico', () => {
  let cryptico = null,
      aRSAkey = null,
      publicKeyString = null,
      encText = null;
  const plainText = '茶色い狐がのろまな犬を飛び越えた。';
  //const plainText = 'irohaniwoedochirinuruo';

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
    //console.log(aRSAkey);

    done();
  }).timeout(20000);

  it('publicKeyString生成',()=>{
    publicKeyString = cryptico.publicKeyString(aRSAkey);
    expect(publicKeyString).is.a('String');
  });

  it('暗号化',()=>{
    const buff = new Buffer(plainText, 'utf8');
    const b64PlainText = buff.toString('base64');

    const encObj = cryptico.encrypt(b64PlainText, publicKeyString);

    if (encObj.status === 'success') {
      encText = encObj.cipher;
      expect(encText).is.a('String');

      return;
    }
    throw new Error(`cryptico.encrypt error!(status=${encObj.status})`);
  });

  it('復号',()=>{
    const decObj = cryptico.decrypt(encText, aRSAkey);

    if (decObj.status === 'success') {
      expect(decObj.signature).is.equal('unsigned');
      const buff = new Buffer(decObj.plaintext, 'base64');

      expect(buff.toString('utf8')).is.equal(plainText);

      return;
    }
    throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
  });

  it('署名',()=>{
    const passPhrase ='other key',
          bits = 1024,
          otherRkey = cryptico.generateRSAKey(passPhrase, bits),
          otherPKey = cryptico.publicKeyString(otherRkey);

    const signedEncObj = cryptico.encrypt(plainText,publicKeyString,otherRkey);
    console.log(signedEncObj);

    const decObj = cryptico.decrypt(signedEncObj.cipher, publicKeyString, otherPKey);
    console.log(decObj);


  });
});
