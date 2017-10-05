/* contentsManager:generateContentsID.js */
/*eslint-env node,  */

function define(func) {
  module.exports = func(require);
}

define(() => {
  return function (cntxt) {
    // cntxt.counter
    // cntxt.prefix
    cntxt.counter += 1;
    const counter = cntxt.counter;

    if (counter > 99999) {
      throw new Error(`overflow countentsID count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [cntxt.contentsIdBase, counterStr].join('');
  };
});
