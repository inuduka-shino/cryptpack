/* test_error.js */
/*eslint-env node, mocha */
/*eslint no-console: "off" */
/*eslint no-unused-expressions: "off" */

const expect = require('chai').expect;
const errorModule = require('../static/js/error.js');

describe('module IF test', () => {
  it('check load Moduel', ()=>{
    expect(errorModule).is.a('object');
  });
  it('check CError type', ()=>{
    expect(errorModule).has.a.property('CError');
    expect(errorModule.CError).is.a('function');
  });
  it('check getOriginalError type', ()=>{
    expect(errorModule).has.a.property('getOriginalError');
    expect(errorModule.getOriginalError).is.a('function');
  });
  it('check isError type', ()=>{
    expect(errorModule).has.a.property('isError');
    expect(errorModule.isError).is.a('function');
  });
});
describe('code symbol test', () => {
  it('regist Code', () => {
    const cd = errorModule.registCode('test01');
    expect(cd).is.equal('test01');
  });
  it('get description', () => {
    const code = errorModule.registCode('test02', 'description sample'),
          desc = errorModule.description('test02');
    expect(code).is.equal('test02');
    expect(desc).is.equal('description sample');
  });
  it('regist same Code', () => {
    const codeName = 'test03';
    errorModule.registCode(codeName);
    expect(errorModule.registCode.bind(null,codeName))
      .to.throw(/^can not regist error code\. alrady code\(test03\) exist.$/);
  });
  it('get no-exist Code', () => {
    expect(errorModule.description.bind(null,'no-code'))
      .to.throw(/^unkown Error code\(no-code\)$/);
  });
});
describe('throw Error test', () => {
  it('no code Error', ()=>{
    expect(()=>{
      throw new errorModule.CError('sample error');
    }).throw(errorModule.CError, /^sample error$/);
  });
  it('Error with code Error', ()=>{
    expect(()=>{
      throw new errorModule.CError('test05', 'sample error 05');
    }).throw(errorModule.CError, /^\(test05\):sample error 05$/);
  });
  describe('util test', () => {
    function a() {
      throw new errorModule.CError('testUT01', 'sample error');
    }
    it('isError test', ()=>{
      try {
        a();
      } catch (err) {
        expect(errorModule.isError(err, 'testUT01')).is.true;
        expect(errorModule.isError.bind(null, err, 'testUT02')).throw();
      }
    });
    it('getOriginalError test', ()=>{
      //
    });
  });
  describe('error stack test', () => {
    function a() {
      throw new errorModule.CError('testST01', 'sample error');
    }
    function b() {
      a();
    }
    it('stack  test', ()=>{
      try {
        b();
      } catch (err) {
        expect(err.stack).is.match(/^CError: \(testST01\):sample error/);
        expect(err.stack).is.match(/at a /);
        expect(err.stack).is.match(/at b /);
      }
     });
  });
});
