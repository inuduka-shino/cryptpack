/*eslint-env node, mocha */
/*eslint no-console: "off" */

const expect = require('chai').expect;

/*----
  loadしたdaataを をproxyに展開するところで、
  汎用の階層構造 proxyの検討が必要なので、
  ObjectSaverのProxyインタフェースはやめ。
----*/


describe.skip('json parse for proxy Object', () => {
  const t = {
    v: 'V',
    x: 'X',
  };

  const p = new Proxy(t, {

    get (tObj, propName) {
      //console.log(`debug:get ${propName}`);
      if (propName === 'v') {
        return `x val:${t.x}`;
      }
      if (propName === 'x') {
        return `v val:${t.v}`;
      }
      return t[propName];
    },
    set  (tObj, propName, val) {
      if (propName === 'v') {
        t.v = `[[${val}]]`;
        return;
      }
      if (propName === 'x') {
        t.x = `[${val}]`;
        return;
      }
      t[propName] = val;
    },
  });

  it('check Proxy Object', ()=>{
    expect(p.v).is.equal('x val:X');
    expect(p.x).is.equal('v val:V');
    p.v='A';
    p.x='B';
    expect(p.v).is.equal('x val:[B]');
    expect(p.x).is.equal('v val:[[A]]');

  });
  it('json stringify Proxy Object', ()=>{
    p.v='A';
    p.x='B';
    const j = JSON.stringify(p);
    //console.log(j);
    expect(j).is.equal('{"v":"x val:[B]","x":"v val:[[A]]"}');
  });
  it('json Perse Proxy Object', ()=>{
    p.v='A';
    p.x='B';
    const j = JSON.stringify(p);
    //console.log(j);
    expect(j).is.equal('{"v":"x val:[B]","x":"v val:[[A]]"}');
  });

});
