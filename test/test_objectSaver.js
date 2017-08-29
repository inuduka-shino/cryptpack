/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const expect = require('chai').expect;
const objectSaver = require('../modules/objectSaver');


describe('obecjtSaver TEST', () => {
  it('require objectSaver',() => {
    expect(objectSaver).is.a('Function');
  });
  it('gen instance',() => {
    const saver = objectSaver({},{},{},{});
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
          propMap={
            'A': 'a',
            'B': 'b',
          },
          initSaveData = {
            'A': 'initA',
            'B': 'initB',
          },
          objSaver = objectSaver({
            cntxt,
            saver,
            propMap,
            initSaveData,
          });

    it('check init',() => {
      objSaver.init();
      expect(cntxt.b).is.equal('initB');
      expect(cntxt.a).is.equal('initA');
    });
    it('check save',() => {
      cntxt.a = 'NEW A';
      objSaver.flush();
      expect(JSON.parse(dummySaverData).A).is.equal('NEW A');
    });
    it('check init2',() => {
      const cntxt2 = {
        'a': 'OLD',
        'b': 'OLD',
      };
      const objSaver2 = objectSaver({
        cntxt: cntxt2,
        saver,
        propMap,
        initSaveData,
      });

      dummySaverData = '{"A":"NEW A","B":"NEW B"}';
      objSaver2.init();
      expect(cntxt2.a).is.equal('NEW A');
      expect(cntxt2.b).is.equal('NEW B');
    });
  });
});
