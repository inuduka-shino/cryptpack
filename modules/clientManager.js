/* clientManager.js */
/*eslint-env node */
/*eslint-disable no-console: "warn" */

const fs = require('fs'),
      util = require('util');

const fsReadFile = util.promisify(fs.readFile),
      fsWriteFile = util.promisify(fs.writeFile);

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

  if (clientMap.couter > 99999) {
    throw new Error(`overflow client map count over ${counter}`);
  }
  const counterStr = ('00000' + counter).slice(-5);

  return [counter, clientIdBase + 'CA' + counterStr];
}

function clientMapFile(mapFilePath) {
    function loadMap() {
      const loadPromise = fsReadFile(
        mapFilePath,
        {
            flag: 'r',
            encoding: 'utf8'
          }
        );

      return (
        loadPromise
        .then((data) => {
            return JSON.parse(data);
        })
        .catch((err) => {
          if (err.code === 'ENOENT') {

            return {
              title: 'client map',
              counter: 0,
            };
          }
          throw new Error(`Mapfile read error! err.code=(${err.code}) filepath=(${mapFilePath})`);
        })
      );
    }

    function saveMap(data) {
      return fsWriteFile(
        mapFilePath,
        JSON.stringify(data),
        {
          flag: 'w',
          encoding: 'utf8'
        }
      );
    }

    return {
      loadMap,
      saveMap
    };

}

  function generate(clientMapFilePath) {
    const cmFile = clientMapFile(clientMapFilePath);
    let clientMap = null;

    async function registClient(clientInfo) {
      if (clientMap === null) {
        clientMap = await cmFile.loadMap();
      }
      const [counter, clientId] = genClientId(clientMap);

      clientMap.counter = counter;
      clientMap[clientId] = genClientData(clientId, clientInfo);

      await cmFile.saveMap(clientMap);

      return clientId;
    }

    async function getClient(clientId) {
      if (clientMap === null) {
        clientMap = await cmFile.loadMap();
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

  return {
      generate
    };
})();
