/* cx.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() =>{
  function cxCommand(commandName, body) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return fetch(
      `./cx/${commandName}`,
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

  return {
    getRandSeed () {
      return cxCommand('getRandSeed');
    },
    regPubKey: dummy('regPubKey','DUMMYID001'),
    getTestMessage: dummy('getTestMessage','dummyMessage'),

  };
});
