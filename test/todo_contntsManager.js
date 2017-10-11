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
      fsReaddir = util.promisify(fs.readdir),
      fsReadFile = util.promisify(fs.readFile);

const debug = Symbol.for('debug');

function unlinkForce(filepath) {
  return fsUnlink(filepath).catch((err)=>{
    if (err.code !== 'ENOENT') {
      throw err;
    }
  });
}
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
        sampleSrcFileFolderPath = `${workFolderPath}/src`,
        sampleSrcFile = `${sampleSrcFileFolderPath}/testSrc.txt`,
        contentsIdBase='TEST_';

  async function clearContents() {
    await mkdirForce(workFolderPath);
    await Promise.all([
      mkEmptyDir(destFileFolderPath),
      unlinkForce(testfilepath),
    ]);
  }
  function readContents(contentsID) {
    return fsReadFile(
      path.join(destFileFolderPath,contentsID),
      {
        encoding : 'utf8'
      }
    );
  }
  function readContentManagerSaveFile() {
    return jsonFile(testfilepath).load();
  }

  before(async ()=>{
    await clearContents();
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
    before(async ()=>{
      await clearContents();
    });
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
      const contentsData = await fsReadFile(
        path.join(destFileFolderPath,contentsID),
        {
          encoding : 'utf8'
        }
      );
      expect(contentsData).is.equal('サンプル');
    });
  });
  describe('regist', ()=>{
    beforeEach(async ()=>{
      await clearContents();
    });
    it('regist DocInfo', async () =>{
      const sampleData = 'いろはにほへと',
            sampleTitle = 'title is いろは';
      const contentsMng = await gencContentsManager();
      const clientID='AAAA';
      const counter = contentsMng.client(clientID);
      const docInfo = contentsMng.genDocInfo(['text', sampleData, sampleTitle]);
      const contentsID = counter.add(docInfo);
      await counter.regist();
      // check contentsManageer saver file
       const cmjObj = await readContentManagerSaveFile();
       expect(cmjObj.title).is.equal('contents map');
      // check contents
      const contentsData = await readContents(contentsID);
      expect(contentsData).is.equal(sampleData);
      expect(cmjObj.contentsInfo[contentsID].title).is.equal(sampleTitle);
      // check indexContents
      const indexContentsID = counter.getIndexContentsID();
      const indexData = await readContents(indexContentsID),
            indexObj = JSON.parse(indexData);
      expect(indexObj.contentsList[0]).is.deep.equal([contentsID, sampleTitle]);
    });
    it('regist DocInfo twice', async () =>{
      const clientID='AAAZ';
      let indexContentsID = null;
      await (async ()=>{
        const sampleData = '最初',
              sampleTitle = 'Sample 01';
        const contentsMng = await gencContentsManager();
        const counter = contentsMng.client(clientID);
        const docInfo = contentsMng.genDocInfo(['text', sampleData, sampleTitle]);
        counter.add(docInfo);
        await counter.regist();
      })();
      await (async ()=>{
        const contentsMng = await gencContentsManager();
        const counter = contentsMng.client(clientID);
        const docInfo = contentsMng.genDocInfo(['file', sampleSrcFile]);
        counter.add(docInfo);
        await counter.regist();
        indexContentsID = counter.getIndexContentsID();
      })();
      // check indexContents
      const indexData = await readContents(indexContentsID),
            indexObj = JSON.parse(indexData);
      expect(indexObj.contentsList[0][1]).is.equal('Sample 01');
      expect(indexObj.contentsList[1][1]).is.equal('testSrc.txt');
    });
  });

});
