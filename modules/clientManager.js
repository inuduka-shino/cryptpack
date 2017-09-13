/* clientManager.js */
/*eslint-env node */
/*eslint-disable no-console: "warn" */

function define(func) {
  module.exports = func(require);
}

define((require) => {
  const jsonFile = require('./jsonFile'),
        objectSaver = require('./objectSaver');

  function genClientId(cntxt) {
    const counter = cntxt.counter + 1;

    if (counter > 99999) {
      throw new Error(`overflow client map count over ${counter}`);
    }
    const counterStr = ('00000' + counter).slice(-5);

    return [counter, cntxt.clientIdBase + 'CA' + counterStr];
  }

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

    function genClientData(clientId, clientInfo) {
      return {
        clientId,
        clientName: clientInfo.clientName,
        publicKeyString: clientInfo.publicKeyString,
      };
    }
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

  function generate(clientMapFilePath) {
    const clientIdBase = 'ASS002';
    const cntxt = {
          clientIdBase,
          saver: null,
          // mapping from json File
          counter: null,
          clientInfo: null,
        };

    cntxt.saver = objectSaver({
        cntxt,
        saver: jsonFile(clientMapFilePath),
        propList:  [
          'counter',
          'clientInfo'
        ],
        initSaveData:{
          //
          title: 'client map',
          // for countns id
          counter: 0,
          clientInfo: {},
        },
      });

    return {
      registClient,
      getClient,
    };
  }

  return generate;
});
