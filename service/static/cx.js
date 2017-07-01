/* cx.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() =>{
  function cxCommand(commandName, body) {
    return fetch(
      './cx/' + commandName,
      {
        method: 'POST',
        headers: (new Headers()).append('Content-Type', 'application/json'),
        body: JSON.stringify(body)
    })
    .then((res) => {
      return res.json();
    })
    .then((resObj) => {
      if (resObj.status === 'ok') {
        return resObj.val;
      }
      throw new Error(resObj.message);
    });
  }
  function dummy(retVal) {
    return () =>{
        return new Promise((resolve)=>{
          resolve(retVal);
        });
    };
  }

  return {
    getRandSeed () {
      return cxCommand('getRandSeed');
    },
    regPubKey: dummy('DUMMYID001'),
    getTestMessage: dummy('dummyMessage'),

  };
});
