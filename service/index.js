/* static-page index.js */
/*eslint-env node */
/*eslint max-statements: ["warn", 20]*/
/*eslint no-console: off */

const path = require('path'),
      Koa = require('koa'),
      Router = require('koa-router'),
      bodyParser = require('koa-bodyparser'),
      serv = require('koa-static');

const cxServices = require('./cxService');
const app = new Koa();
const router = new Router();

router.get(/^\/test$/, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = 'test';
  //ctx.redirect('/');
  //await nextx();
});


router.post('/cx/:cmd', bodyParser(), async (ctx, nextp) => {
  ctx.response.status = 200;
  ctx.response.set('Content-Type','application/json');
  try {
    const valPromise = cxServices(
      ctx.params.cmd,
      ctx.request.body
    );
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
  await nextp();
});

router.get(/.*/, serv(
  path.join(__dirname, 'static/'), {
    index: 'main.html',
    extensions: ['html']
  }
));

app
.use(router.routes())
.use(router.allowedMethods());

module.exports = app;
