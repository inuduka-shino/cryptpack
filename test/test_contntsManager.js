/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager'),
      expect = require('chai').expect,
      util = require('util'),
      fs = require('fs');

const fsUnlink = util.promisify(fs.unlink),
      fsMkdir = util.promisify(fs.mkdir),
      noop= ()=>{}; //eslint-disable-line no-empty-function, func-style

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

    it('reist',async () => {
      const contentsMng = contentsManager({
        contentsIdBase: 'TEST02',
        jsonFilePath: testfilepath,
        destFileFolderPath,
      });
      contentsMng.regist();

    });

  });
});
