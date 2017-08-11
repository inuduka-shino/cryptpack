/* regClient serviceApplication.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define((require)=>{
  const
        pCryptico = require('cryptico'),
        cxMng = require('../cx/cx'),
        //domUtil = require('./domUtil'),
        //cryptoTest = require('./cryptoTest'),
        base64Util = require('../base64Util'),
        clientSaver = require('../clientSaver');

  const cryptico = pCryptico.cryptico;
  const cx = cxMng();
  const clntSvr = clientSaver.generate();

  const clientEnv = (()=>{
    const userId = 'demo01';
    let aRSAKey = null,
        clientId = null,
        userInfo = null;

    async function loadClientEnv() {
      if (userInfo === null) {
        userInfo = await clntSvr.loadUserInfo(userId);
        clientId = userInfo.lastClientId;
      }
      if (aRSAKey === null) {
        aRSAKey = clntSvr.loadRSAKey(clientId);
      }
    }
    function saveClientEnv(cli, rsakey) {
      clientId = cli;
      aRSAKey = rsakey;
      // db 保管
      clntSvr.saveRSAKey(clientId, aRSAKey);
      clntSvr.saveUserInfo(userId, {
        lastClientId: clientId,
      });

    }

    return {
      userId,
      loadClientEnv,
      saveClientEnv,
    };
  })();


  async function regSeckey() {
    const bits = 1024;

    // 乱数取得
    const seed = await cx.getRandSeed();

    // key作成
    const aRSAkey = cryptico.generateRSAKey(seed, bits);
    const publicKeyString = cryptico.publicKeyString(aRSAkey);

    // サービス登録
    const clientId = await cx.regPubKey(clientEnv.userId, publicKeyString);

    clientEnv.saveClientEnv(
      clientId, aRSAkey
    );

  }

  function getTestMessages () {
    const envPrms = clientEnv.loadClientEnv();
    return [0,1,2].map((testId)=>{
      return envPrms.then((env) => {
        return [env, cx.getTestMessage(env.clientId, testId)];
      }).then(([env,enctext]) => {
        const decObj = cryptico.decrypt(enctext, env.aRSAKey);

        if (decObj.status !== 'success') {
          throw new Error(`cryptico.decrypt error!(status=${decObj.status})`);
        }

        return base64Util.decode(decObj.plaintext);
      });
    });

  }

  return {
    regSeckey,
    getTestMessages,
  };
});
