/* testMessage.js */
/*eslint-env node */

const testMessage = [
  'abcd',
  'efgh',
  'あいうえお'
];


module.exports = (()=>{
  return {
    get (idx) {
      return testMessage[idx];
    }
  };
})();
