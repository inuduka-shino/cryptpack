/* cx.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() =>{
  let baseUrl = './cx';

  function cxCommand(commandName, body) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return fetch(
      [baseUrl, commandName].join('/'),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(`response status (${res.status}): ${res.message}`);
    })
    .then((resObj) => {
      if (resObj.status === 'ok') {
        return resObj.val;
      }
      throw new Error(resObj.message);
    });
  }
  function dummy(cmd, retVal) {
    return async function () {
      try {
        const ret = await cxCommand(cmd, {
          dummy:'dummy'
        });

        return ret;
      } catch (err) {
        return retVal;
      }
    };
  }

  function cxMng(baseUrl0=null) {
    if (baseUrl0 !== null) {
      baseUrl = baseUrl0;
    }

    return {
      getRandSeed () {
        return cxCommand('getRandSeed');
      },
      regPubKey(clientName, publicKeyString) {
        return cxCommand('regPubKey',{
          clientName,
          publicKeyString
        });
      },
      getTestMessage(clientId, testNum) {
        return cxCommand('getTestMessage',{
          clientId,
          testNum
        });
      },
      dummy: dummy('dummy','dummyMessage'),
    };
  }

  return cxMng;
});
