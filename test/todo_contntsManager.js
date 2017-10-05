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
    await mkdirForce(destFileFolderPath);
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
      expect(docInfo1).has.property('dev');
    });

    it.skip('skip', async () =>{
      const clientID='AAAA';

      const contentsMng = await gencContentsManager();
      const counter = contentsMng.client(clientID);
      const docInfo1 = genDocInfo(srcfile);
      const docInfo2 = genDocInfo({dummy: 'data'});
      counter.stage(docInfo1);
      counter.stage(docInfo2);
      counter.regist(); // 暗号化＋暗号化ファイル生成　jsonfile 保存
      counter.getDocList();

    });
  });
});
