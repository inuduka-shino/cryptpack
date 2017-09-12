/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager'),
      expect = require('chai').expect,
      util = require('util'),
      fs = require('fs'),
      path = require('path'),
      jsonFile = require('../modules/jsonFile');

const fsUnlink = util.promisify(fs.unlink),
      fsMkdir = util.promisify(fs.mkdir),
      fsReaddir = util.promisify(fs.readdir);

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
        destFileFolderPath = `${workFolderPath}/dest`,
        contentsIdBase='TEST02_';

  async function defaultGen() {
    const contentsMng = contentsManager({
      contentsIdBase,
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
    await contentsMng.init();
    return contentsMng;
  }

  before(async ()=>{
    await mkdirForce(workFolderPath);
    await mkdirForce(destFileFolderPath);
  });

  it('require js-moduel',() => {
    expect(contentsManager).is.a('Function');
  });
  it('gen instance',() => {
    const contentsMng = contentsManager({
      contentsIdBase,
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
    expect(contentsMng).has.a.property('dev');
    expect(contentsMng).has.a.property('init');
    expect(contentsMng).has.a.property('regist');
  });

  describe('savefile test', () =>{
    beforeEach(async ()=>{
      await Promise.all([
        fsUnlink(testfilepath).catch((err)=>{
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }),
        fsReaddir(destFileFolderPath).then((fileList)=>{
          return Promise.all(fileList.map((file) => {
              if (file === '.' || file === '..') {
                return true;
              }
              return fsUnlink(path.join(destFileFolderPath,file));
          }));
        }),
      ]);
    });

    it('init',async ()=>{
      const contentsMng = await defaultGen();
      expect(contentsMng.dev.cntxt.counter).is.equal(0);
    });

    it('regist',async ()=>{
      const contentsMng = await defaultGen();
      const srcPath = `${workFolderPath}/src/testSrc.txt`;
      const cntntId = await contentsMng.regist('CI9999',srcPath);

      expect(cntntId).is.equal(`${contentsIdBase}00001`);

      const saveData = await jsonFile(testfilepath).load();
      expect(saveData.title).is.equal('contents map');
      expect(saveData.counter).is.equal(1);
    });

  });

});
