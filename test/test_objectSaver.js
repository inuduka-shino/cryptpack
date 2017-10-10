/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const expect = require('chai').expect;
const objectSaver = require('../modules/objectSaver');


describe('obecjtSaver TEST', () => {
  it('require objectSaver',() => {
    expect(objectSaver).is.a('Function');
  });
  it('gen instance',() => {
    const saver = objectSaver({
      //
      propList: []
    });
    expect(saver).has.a.property('init');
    expect(saver).has.a.property('flush');
  });
  describe('check function',()=>{
    let dummySaverData = null;
    function dummyLoad () {
        if (dummySaverData === null) {
          return null;
        }
        return Promise.resolve(JSON.parse(dummySaverData));
      }
    function dummySave(obj) {
        dummySaverData = JSON.stringify(obj);
        return Promise.resolve();
      }
    const objInfo = {
            'a': 'AAA',
            'a1': 'xxx',
          },
          saver = {
            load: dummyLoad,
            save: dummySave,
          },
          propList=['a', 'b'],
          initSaveData = {
            'a': 'initA',
            'b': 'initB',
          },
          objSaver = objectSaver({
            objInfo,
            saver,
            propList,
            initSaveData,
          });

    it('check init without overwrite',async () => {
      const objSaver0 = objectSaver({
              objInfo,
              saver,
              propList,
              // no init data
            });
      await objSaver0.init();
      expect(objInfo.a).is.equal('AAA');
      expect(objInfo.b).is.a('undefined');
      expect(objInfo.a1).is.equal('xxx');
    });
    it('check init',async () => {
      await objSaver.init();
      expect(objInfo.a).is.equal('initA');
      expect(objInfo.b).is.equal('initB');
      await objSaver.initOrDoNothing();
      expect(objInfo.a).is.equal('initA');
      expect(objInfo.b).is.equal('initB');
    });
    it('check initOrDoNothing',async () => {
      await objSaver.initOrDoNothing();
      expect(objInfo.a).is.equal('initA');
      expect(objInfo.b).is.equal('initB');
    });
    it('check save',async () => {
      await objSaver.initOrDoNothing();
      expect(objInfo.a).is.equal('initA');
      expect(objInfo.b).is.equal('initB');
      objInfo.a = 'NEW A';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a).is.equal('NEW A');
    });
    it('check init2',async () => {
      const objInfo2 = {
        'a': 'OLD',
        'b': 'OLD',
      };
      const objSaver2 = objectSaver({
        objInfo: objInfo2,
        saver,
        propList: ['a', 'b'],
      });

      dummySaverData = '{"a":"NEW AA","b":"NEW BB"}';
      await objSaver2.init();
      expect(objInfo2.a).is.equal('NEW AA');
      expect(objInfo2.b).is.equal('NEW BB');
    });
    it('subObject',async () => {
      const objInfo = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
      };
      const objSaver = objectSaver({
        objInfo,
        saver,
        propList: ['a.aa', 'b'],
      });

      dummySaverData = '{"a":{"aa":"NEW AA"} ,"c":{"cc": "NEW CC"}}';
      await objSaver.init();

      expect(objInfo.a.aa).is.equal('NEW AA');
      objInfo.a.aa = 'N-AAA';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');

    });
    it('use Proxy',async () => {
      const objInfo = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
        'CC': 'INIT C',
      };
      const handler = {
        get (objInfo, name) {
          if (name === 'a') {
            return objInfo.a.aa;
          }
          if (name === 'c') {
            return objInfo.CC;
          }
          return objInfo[name];
        },
        set (objInfo, name, val) {
          if (name === 'a') {
            objInfo.a.aa = val;
            return;
          }
          if (name === 'c') {
            objInfo.CC = val;
            return;
          }
          objInfo[name] = val;
        },
      },
      pobjInfo =new Proxy(objInfo, handler);

      const objSaver = objectSaver({
        objInfo: pobjInfo,
        saver,
        propList: ['a', 'b', 'c'],
      });

      dummySaverData = null;
      await objSaver.init();
      await objSaver.flush();
      const saveImage = JSON.parse(dummySaverData);
      expect(saveImage.a).is.equal('INIT A');
      expect(saveImage.b).is.equal('INIT B');
      expect(saveImage.c).is.equal('INIT C');

      const objInfo2={
        a: {}
      },
      pobjInfo2 =new Proxy(objInfo2,handler);

      const objSaver2 = objectSaver({
        objInfo: pobjInfo2,
        saver,
        propList: ['a', 'b', 'c'],
      });
      await objSaver2.init();
      expect(objInfo2.a.aa).is.equal('INIT A');
      expect(objInfo2.b).is.equal('INIT B');
      expect(objInfo2.CC).is.equal('INIT C');

    });
    it('subObject2',async () => {
      const objInfo = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
      };
      const objSaver = objectSaver({
        objInfo,
        saver,
        propList: ['a', 'b'],
      });

      dummySaverData = '{"a":{"aa":"NEW AA", "ac":"NEW AC"} ,"c":{"cc": "NEW CC"}}';
      await objSaver.init();
      expect(objInfo.a.aa).is.equal('NEW AA');
      expect(objInfo.a.ac).is.equal('NEW AC');

      objInfo.a.aa = 'N-AAA';
      objInfo.a.ab = 'N-ABB';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');
      expect(JSON.parse(dummySaverData).a.ab).is.equal('N-ABB');
    });
  });
});
