/*eslint-env node, mocha,  */
/*eslint-disable no-console:"warn" */

const path = require('path'),
      expect = require('chai').expect,
      fs = require('fs'),
      util = require('util'),
      clientManager = require('../modules/clientManager');
const unlink = util.promisify(fs.unlink),
      noop= ()=>{}; //eslint-disable-line no-empty-function, func-style

describe('clientManger',()=>{

  it('load module',() => {
    expect(clientManager).is.a('Function');
  });

  it('generate', () => {
    const cmi = clientManager(
          path.join(__dirname, 'work/dummy.json')
        );

    expect(cmi).is.a('Object');
    expect(cmi).has.property('registClient');
    expect(cmi).has.property('getClient');
  });

  it('registClient', async () => {
    const testfilepath = path.join(__dirname, 'work/test3.json');

    await unlink(testfilepath).catch(noop);

    const cmi = clientManager(testfilepath);
    const clientId = await cmi.registClient({
      clientName: 'testname',
      publicKeyString: '<pub Keyy>'
    });

    expect(clientId).is.a('string');
    expect(clientId).is.equal('ASS002CA00001');
    // json file check!


    const cmi2 = clientManager(testfilepath);
    const clientId2 = await cmi2.registClient({
      clientName: 'testname',
      publicKeyString: '<pub Keyy>'
    });

    expect(clientId2).is.a('string');
    expect(clientId2).is.equal('ASS002CA00002');
  });

  it('getClient', async () => {
    const testfilepath = path.join(__dirname, 'work/test4.json'),
          testString = 'pubkey string abc';

    let clilentID=null;

    await unlink(testfilepath).catch(noop);
    await (async () => {
      const cmi = clientManager(testfilepath);

      const clientIdx = await cmi.registClient({
        clientName: 'testname',
        publicKeyString: '<pub Keyy>'
      });

      clilentID = await cmi.registClient({
        clientName: 'testname2',
        publicKeyString: testString
      });

      expect(clientIdx).is.not.equal(clilentID);
    })();

    const cmi2 = clientManager(testfilepath);
    const clnt = await cmi2.getClient(clilentID);

    expect(clnt.publicKeyString()).is.equal(testString);
  });
});
