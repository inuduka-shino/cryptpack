/* static-page index.js */
/*eslint-env node */
/*eslint no-console: off */

const path = require('path'),
      Koa = require('koa'),
      serv = require('koa-static');

const cxServices = require('./cxService');
const app = new Koa();

const commandPrefix = '/cx/',
      commandPrefixLen = commandPrefix.length;

//eslint-disable-next-line max-statements
app.use(async (ctx, next) => {
  //console.log(`ctx.request.path = ${ctx.request.path}`);
  if (ctx.request.path.startsWith(commandPrefix)) {
    //TODO body parse
    ctx.response.status = 200;
    ctx.response.set('Content-Type','application/json');
    try {
      const valPromise = cxServices(ctx.request.path.slice(commandPrefixLen), ctx.request);
      let val=null;

      if (valPromise.then) {
        val = await valPromise;
      } else {
        val = valPromise;
      }
      ctx.response.body = {
        status:'ok',
        val
      };
    } catch (e) {
      ctx.response.body = {
        status:'error',
        message: e.message,
        error: e
      };
    }
  } else {
    const servFnc = serv(
            path.join(__dirname, 'static/'), {
              index: 'main.html',
              extensions: ['html']
            }
          );

    await servFnc(ctx, next);
  }
});

module.exports = app;
