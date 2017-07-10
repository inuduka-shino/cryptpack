/* static-page index.js */
/*eslint-env node */
/*eslint no-console: off */

const path = require('path'),
      Koa = require('koa'),
      Router = require('koa-router'),
      serv = require('koa-static');

const cxServices = require('./cxService');
const app = new Koa();
const router = new Router();

const commandPrefix = '/cx/',
      commandPrefixLen = commandPrefix.length;

router.get(/^\/test$/, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = 'test';
  //ctx.redirect('/');
  //await nextx();
});


router.post(/.*/, async (ctx, next) => {
  console.log(`ctx.request.path = ${ctx.request.path}`);
  if (ctx.request.path.startsWith(commandPrefix)) {
    console.log('CXコマンド処理');
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
    console.log('static');
    const servFnc = serv(
            path.join(__dirname, 'static/'), {
              index: 'main.html',
              extensions: ['html']
            }
          );

    await servFnc(ctx, next);
  }
});

router.get(/.*/, serv(
  path.join(__dirname, 'static/'), {
    index: 'main.html',
    extensions: ['html']
  }
));

app
.use(async (ctx, nextx) => {
  console.log(`app.use: ${ctx.request.path}`);
  await nextx();
})
.use(router.routes())
.use(router.allowedMethods());

module.exports = app;
