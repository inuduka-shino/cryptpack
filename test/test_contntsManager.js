/*eslint-env node, mocha */
/*eslint-disable no-console:"warn" */

const cntntsMng = require('../modules/contentsManager'),
      expect = require('chai').expect;


describe('contents manager TEST', () => {
  it('require js-moduel',() => {
    expect(cntntsMng).is.a('Object');
  });
  it('check member',() => {
    expect(cntntsMng).has.a.property('aaa');
    expect(cntntsMng).has.a.property('bbb');
  });
});
