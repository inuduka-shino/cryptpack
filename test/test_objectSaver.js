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
        return JSON.parse(dummySaverData);
      }
    function dummySave(obj) {
        dummySaverData = JSON.stringify(obj);
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

    it('check init without overwrite',() => {
      const objSaver0 = objectSaver({
              cntxt,
              saver,
              propList,
              // no init data
            });
      objSaver0.init();
      expect(cntxt.a).is.equal('AAA');
      expect(cntxt.b).is.a('undefined');
      expect(cntxt.a1).is.equal('xxx');
    });
    it('check init',() => {
      objSaver.init();
      expect(cntxt.a).is.equal('initA');
      expect(cntxt.b).is.equal('initB');
    });
    it('check save',() => {
      cntxt.a = 'NEW A';
      objSaver.flush();
      expect(JSON.parse(dummySaverData).a).is.equal('NEW A');
    });
    it('check init2',() => {
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
      objSaver2.init();
      expect(cntxt2.a).is.equal('NEW AA');
      expect(cntxt2.b).is.equal('NEW BB');
    });
    it('subObject',() => {
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
      objSaver.init();

      expect(cntxt.a.aa).is.equal('NEW AA');
      cntxt.a.aa = 'N-AAA';
      objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');

    });
    it('use Proxy',() => {
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
      objSaver.init();
      objSaver.flush();
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
      objSaver2.init();
      expect(cntxt2.a.aa).is.equal('INIT A');
      expect(cntxt2.b).is.equal('INIT B');
      expect(cntxt2.CC).is.equal('INIT C');

    });
    it('subObject2',() => {
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
      objSaver.init();
      expect(cntxt.a.aa).is.equal('NEW AA');
      expect(cntxt.a.ac).is.equal('NEW AC');

      cntxt.a.aa = 'N-AAA';
      cntxt.a.ab = 'N-ABB';
      objSaver.flush();
      expect(JSON.parse(dummySaverData).a.aa).is.equal('N-AAA');
      expect(JSON.parse(dummySaverData).a.ab).is.equal('N-ABB');

    });
  });
});
