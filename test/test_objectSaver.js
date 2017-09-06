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
    const cntxt = {
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
            cntxt,
            saver,
            propList,
            initSaveData,
          });

    it('check init without overwrite',async () => {
      const objSaver0 = objectSaver({
              cntxt,
              saver,
              propList,
              // no init data
            });
      await objSaver0.init();
      expect(cntxt.a).is.equal('AAA');
      expect(cntxt.b).is.a('undefined');
      expect(cntxt.a1).is.equal('xxx');
    });
    it('check init',async () => {
      await objSaver.init();
      expect(cntxt.a).is.equal('initA');
      expect(cntxt.b).is.equal('initB');
    });
    it('check save',async () => {
      cntxt.a = 'NEW A';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a).is.equal('NEW A');
    });
    it('check init2',async () => {
      const cntxt2 = {
        'a': 'OLD',
        'b': 'OLD',
      };
      const objSaver2 = objectSaver({
        cntxt: cntxt2,
        saver,
        propList: ['a', 'b'],
      });

      dummySaverData = '{"a":"NEW AA","b":"NEW BB"}';
      await objSaver2.init();
      expect(cntxt2.a).is.equal('NEW AA');
      expect(cntxt2.b).is.equal('NEW BB');
    });
    it('subObject',async () => {
      const cntxt = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
      };
      const objSaver = objectSaver({
        cntxt,
        saver,
        propList: ['a.aa', 'b'],
      });

      dummySaverData = '{"a":{"aa":"NEW AA"} ,"c":{"cc": "NEW CC"}}';
      await objSaver.init();

      expect(cntxt.a.aa).is.equal('NEW AA');
      cntxt.a.aa = 'N-AAA';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');

    });
    it('use Proxy',async () => {
      const cntxt = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
        'CC': 'INIT C',
      };
      const handler = {
        get (cntxt, name) {
          if (name === 'a') {
            return cntxt.a.aa;
          }
          if (name === 'c') {
            return cntxt.CC;
          }
          return cntxt[name];
        },
        set (cntxt, name, val) {
          if (name === 'a') {
            cntxt.a.aa = val;
            return;
          }
          if (name === 'c') {
            cntxt.CC = val;
            return;
          }
          cntxt[name] = val;
        },
      },
      pCntxt =new Proxy(cntxt, handler);

      const objSaver = objectSaver({
        cntxt: pCntxt,
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

      const cntxt2={
        a: {}
      },
      pCntxt2 =new Proxy(cntxt2,handler);

      const objSaver2 = objectSaver({
        cntxt: pCntxt2,
        saver,
        propList: ['a', 'b', 'c'],
      });
      await objSaver2.init();
      expect(cntxt2.a.aa).is.equal('INIT A');
      expect(cntxt2.b).is.equal('INIT B');
      expect(cntxt2.CC).is.equal('INIT C');

    });
    it('subObject2',async () => {
      const cntxt = {
        'a': {
            'aa': 'INIT A'
          },
        'b': 'INIT B',
      };
      const objSaver = objectSaver({
        cntxt,
        saver,
        propList: ['a', 'b'],
      });

      dummySaverData = '{"a":{"aa":"NEW AA", "ac":"NEW AC"} ,"c":{"cc": "NEW CC"}}';
      await objSaver.init();
      expect(cntxt.a.aa).is.equal('NEW AA');
      expect(cntxt.a.ac).is.equal('NEW AC');

      cntxt.a.aa = 'N-AAA';
      cntxt.a.ab = 'N-ABB';
      await objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');
      expect(JSON.parse(dummySaverData).a.ab).is.equal('N-ABB');
    });
  });
});
