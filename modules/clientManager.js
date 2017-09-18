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
    cntxt.counter = counter;

    return cntxt.clientIdBase + 'CA' + ('00000' + counter).slice(-5);
  }

  function genClientData(clientId, clientInfo) {
    return {
      clientId,
      clientName: clientInfo.clientName,
      publicKeyString: clientInfo.publicKeyString,
    };
  }

  async function registClient(cntxt, clientInfo) {
    await cntxt.saver.initOrDoNothing();

    const clientId = genClientId(cntxt);
    cntxt.clientInfo[clientId] = genClientData(clientId, clientInfo);

    await cntxt.saver.flush();

    return clientId;
  }

  async function getClient(cntxt, clientId) {
    await cntxt.saver.initOrDoNothing();
    const _=null;

    return {
      //
      publicKeyString () {
        return cntxt.clientInfo[clientId].publicKeyString;
      },
      _,
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
        objInfo: cntxt,
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
      registClient: registClient.bind(null, cntxt),
      getClient: getClient.bind(null, cntxt),
    };
  }

  return generate;
});
