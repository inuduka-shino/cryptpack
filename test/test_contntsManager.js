/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager'),
      expect = require('chai').expect,
      util = require('util'),
      fs = require('fs');

const fsUnlink = util.promisify(fs.unlink);

describe('contents manager TEST', () => {
  const testfilepath = 'work/contentsManage.json';

  it('require js-moduel',() => {
    expect(contentsManager).is.a('Function');
  });
  it('gen instance',() => {
    const contentsMng = contentsManager(testfilepath);
    expect(contentsMng).has.a.property('load');
    expect(contentsMng).has.a.property('save');
  });
  it('init load',async () => {
    const contentsMng = contentsManager(testfilepath);
    await fsUnlink(testfilepath).catch((err)=>{
      if (err.code !== 'ENOENT') {
        throw err;
      }
    });
    const prms = contentsMng.load();
    expect(prms).has.a.property('then');
    const dataInfo = await prms;
    expect(dataInfo).has.a.property('aaa');
    expect(dataInfo).has.a.property('bbb');
  });
});
