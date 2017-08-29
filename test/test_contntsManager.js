/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager'),
      expect = require('chai').expect,
      util = require('util'),
      fs = require('fs');

const fsUnlink = util.promisify(fs.unlink),
      fsMkdir = util.promisify(fs.mkdir);

function mkdirForce(dirpath) {
  return fsMkdir(dirpath).catch((err)=>{
    if (err.code !== 'EEXIST') {
      throw err;
    }
  });
}

describe('contents manager TEST', () => {
  const workFolderPath = 'test/work',
        testfilepath = `${workFolderPath}/contentsManage.json`,
        destFileFolderPath = `${workFolderPath}/dest`;

  before(async ()=>{
    await mkdirForce(workFolderPath);
    await mkdirForce(destFileFolderPath);
  });

  it('require js-moduel',() => {
    expect(contentsManager).is.a('Function');
  });
  it('gen instance',() => {
    const contentsMng = contentsManager({
      contentsIdBase: 'TEST02',
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
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
      const contentsMng = contentsManager({
        contentsIdBase: 'TEST02',
        jsonFilePath: testfilepath,
        destFileFolderPath,
      });
      const prms = contentsMng.dev.load();
      expect(prms).has.a.property('then');
      await prms;
      const dataInfo = contentsMng.dev.cntxt.dataInfo;
      expect(dataInfo).has.a.property('title');
      expect(dataInfo).has.a.property('counter');
    });

    it('save & load',async () => {
      await (async function () {
        const contentsMng = contentsManager({
          contentsIdBase: 'TEST02',
          jsonFilePath: testfilepath,
          destFileFolderPath,
        });

        contentsMng.dev.cntxt.dataInfo = {
          xxx: 'xxxx'
        };
        await contentsMng.dev.save();
      }());
      await (async function () {
        const contentsMng2 = contentsManager({
          contentsIdBase: 'TEST02',
          jsonFilePath: testfilepath,
          destFileFolderPath,
        });
        await contentsMng2.dev.load();
        const ckData2 = contentsMng2.dev.cntxt.dataInfo;
        expect(ckData2).has.a.property('xxx');
      }());
    });
  });
});
