/* clientManager.js */
/*eslint-env node */
/*eslint-disable no-console: "warn" */

const jsonFile = require('./jsonFile');

const clientIdBase = 'ASS002';

module.exports = (()=>{

  function genClientData(clientId, clientInfo) {
    return {
      clientId,
      clientName: clientInfo.clientName,
      publicKeyString: clientInfo.publicKeyString,
    };
  }

  function genClientId(clientMap) {
    const counter = clientMap.counter + 1;

    if (counter > 99999) {
      throw new Error(`overflow client map count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [counter, clientIdBase + 'CA' + counterStr];
  }


  function generate(clientMapFilePath) {
    const cmFile = jsonFile(clientMapFilePath);
    let clientMap = null;

    async function registClient(clientInfo) {
      if (clientMap === null) {
        clientMap = await cmFile.load();
        if (clientMap === null) {
          clientMap = {
            title: 'client map',
            counter: 0,
          };
        }
      }
      const [counter, clientId] = genClientId(clientMap);

      clientMap.counter = counter;
      clientMap[clientId] = genClientData(clientId, clientInfo);

      await cmFile.save(clientMap);

      return clientId;
    }

    async function getClient(clientId) {
      if (clientMap === null) {
        clientMap = await cmFile.load();
      }

      return {
        publicKeyString () {
          return clientMap[clientId].publicKeyString;
        }
      };
    }

    return {
      registClient,
      getClient,
    };
  }

  return generate;
})();
