/* clientManager.js */
/*eslint-env node */
/*eslint-disable no-console */

const fs = require('fs'),
      util = require('util');

const fsReadFile = util.promisify(fs.readFile),
      fsWriteFile = util.promisify(fs.writeFile);

module.exports = (()=>{

  function loadClientData(filepath) {
    return fsReadFile(filepath, {
      flag: 'r',
      encoding: 'utf8'
    }).then((data) => {
        return JSON.parse(data);
    });
  }

  function saveClientData(filepath, data) {
    return fsWriteFile(filepath, JSON.stringify(data), {
      flag: 'w',
      encoding: 'utf8'
    });
  }

  function test1(filepath, val) {
    return saveClientData(filepath,val).then(()=>{
      return 'OK';
    });
  }
  function test2(filepath) {
    return loadClientData(filepath).then(
      (ret) => {
        return {
          loadval: ret.val
        };
      }
    );
  }
  const clientMap = {};

  function registClient(clientName, publicKeyString) {
    const clientId = 'ASS001CL001';

    clientMap[clientId] = publicKeyString;

    return clientId;
  }

  function getClient(clientId) {
    return {
      publicKeyString () {
        return clientMap[clientId];
      }
    };
  }

  return {
    registClient,
    getClient,
    test1,
    test2
  };

})();
