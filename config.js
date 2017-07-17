/* cxService.js */
/*eslint-env node */

const path = require('path');

module.exports = (()=>{
  const dataPath = path.join(__dirname, 'data');

  return {
      clientFilePath: path.join(dataPath, 'clientMng.json')
  };
})();
