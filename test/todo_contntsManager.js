/* todo_contentsManager */
/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const contentsManager = require('../modules/contentsManager');

const expect = require('chai').expect,
      util = require('util'),
      fs = require('fs'),
      path = require('path'),
      jsonFile = require('../modules/jsonFile');

const fsUnlink = util.promisify(fs.unlink),
      fsMkdir = util.promisify(fs.mkdir),
      fsReaddir = util.promisify(fs.readdir);

const debug = Symbol.for('debug');

function mkdirForce(dirpath) {
  return fsMkdir(dirpath).catch((err)=>{
    if (err.code !== 'EEXIST') {
      throw err;
    }
  });
}
function mkEmptyDir(dirPath) {
  return fsMkdir(dirPath).catch((err)=>{
    if (err.code === 'EEXIST') {
      return fsReaddir(dirPath).then((flist)=>{
        return Promise.all(flist.map((filename)=>{
          return fsUnlink(path.join(dirPath, filename));
        }));
      });
    }
    throw err;
  });
}
describe('mkEmptyDir test', () => {
  it('mkEmptyDir test',async ()=>{
      await mkEmptyDir('test/work/dest');
  });
});

describe('contents manager TODO', () => {
  const workFolderPath = 'test/work',
        testfilepath = `${workFolderPath}/contentsManage.json`,
        destFileFolderPath = `${workFolderPath}/dest`,
        contentsIdBase='TEST_';

  /*
  async function defaultGen() {
    const contentsMng = contentsManager({
      contentsIdBase,
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
    await contentsMng.init();
    return contentsMng;
  }
  */

  before(async ()=>{
    await mkdirForce(workFolderPath);
    await mkEmptyDir(destFileFolderPath);
  });

  it('require js-moduel',() => {
    expect(contentsManager).is.a('Function');
  });
  it('call contentsManager',() => {
    const contentsMng = contentsManager({
      contentsIdBase,
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
    expect(contentsMng).has.property(debug);
  });
  async function gencContentsManager() {
     const cMng = contentsManager({
      contentsIdBase,
      jsonFilePath: testfilepath,
      destFileFolderPath,
    });
    await cMng.init();
    return cMng;
  }
  describe('contents manager cntrol image', () => {
    it('gen contentManager & init', async () =>{
      const contentsMng = await gencContentsManager();
      expect(contentsMng).has.property('init');
    });
    it('genDocInfo', async () =>{
      const contentsMng = await gencContentsManager();
      const docInfo1 = contentsMng.genDocInfo('srcfile path');
      expect(docInfo1).has.property(debug);
      expect(docInfo1[debug].title).is.equal('srcfile path');
    });
    it('genDocInfo text', async () =>{
      const contentsMng = await gencContentsManager();
      const docInfo = contentsMng.genDocInfo(['text', 'サンプル', 'Sample Title']);
      expect(docInfo).has.property(debug);
      expect(docInfo[debug].title).is.equal('Sample Title');
      expect(docInfo[debug].stream.read()).is.equal('サンプル');
    });
    it('add DocInfo', async () =>{
      const contentsMng = await gencContentsManager();
      const clientID='AAAA';
      const counter = contentsMng.client(clientID);
      const docInfo = contentsMng.genDocInfo(['text', 'サンプル', 'Sample Title']);
      const contentsID = counter.add(docInfo);
      await Promise.all(counter[debug].wroteContents);
      expect(contentsID).is.a('string');    
    });


  });
});
