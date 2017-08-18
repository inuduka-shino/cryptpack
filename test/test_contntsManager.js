/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager'),
      expect = require('chai').expect,
      util = require('util'),
      fs = require('fs');

const fsUnlink = util.promisify(fs.unlink);

describe('contents manager TEST', () => {
  const testfilepath = 'test/work/contentsManage.json';

  it('require js-moduel',() => {
    expect(contentsManager).is.a('Function');
  });
  it('gen instance',() => {
    const contentsMng = contentsManager(testfilepath);
    expect(contentsMng).has.a.property('dev');
  });
  describe('use file test', () =>{
    beforeEach(async ()=>{
      await fsUnlink(testfilepath).catch((err)=>{
        if (err.code !== 'ENOENT') {
          throw err;
        }
      });
    });

    it('init load',async () => {
      const contentsMng = contentsManager(testfilepath);
      const prms = contentsMng.dev.load();
      expect(prms).has.a.property('then');
      await prms;
      const dataInfo = contentsMng.dev.self.dataInfo;
      expect(dataInfo).has.a.property('title');
      expect(dataInfo).has.a.property('count');
    });
    it('save & load',async () => {
      const contentsMng = contentsManager(testfilepath);
      const contentsMng2 = contentsManager(testfilepath);

      await contentsMng2.dev.load();
      const ckData = contentsMng2.dev.self.dataInfo;
      expect(ckData).has.a.property('title');

      contentsMng.dev.self.dataInfo = {
        xxx: 'xxxx'
      };
      await contentsMng.dev.save();
      await contentsMng2.dev.load();
      const ckData2 = contentsMng2.dev.self.dataInfo;
      expect(ckData2).has.a.property('xxx');
    });
  });
});
