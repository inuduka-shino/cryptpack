/* clientManager.js */
/*eslint-env node */

module.exports = (()=>{
  const clientMap = {};

  function registClient(publicKeyString) {
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
    getClient
  };

})();
