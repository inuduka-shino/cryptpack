/*eslint-env node, mocha */

const path = require('path'),
      expect = require('chai').expect,
      clientManager = require('../modules/clientManager');

describe('clientManger',()=>{
  it('load module',() => {
    expect(clientManager).is.a('Object');
  });

  it('write config',async () => {
    const val = await clientManager.test1(
          path.join(__dirname, 'work/test.json'),
          {
            val: 'かきくけこ'
          }
        );

    expect(val).is.equal('OK');
  });

  it('load config',async () => {
    const val = await clientManager.test2(path.join(__dirname, 'work/test.json'));

    expect(val.loadval).is.equal('かきくけこ');
  });
});
