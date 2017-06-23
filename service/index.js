/* static-page index.js */
/*eslint-env node */
/*eslint no-console: off */

const path = require('path'),
      Koa = require('koa'),
      serv = require('koa-static');

const app = new Koa();

// static resource
app.use(async (ctx, next) => {
  console.log(`ctx.request.path = ${ctx.request.path}`);
  if (ctx.request.path.startsWith('/cx/')) {
    ctx.response.status = 200;
    ctx.response.set('Content-Type','application/json');
    //const date = (new Date()).toString();
    ctx.response.body = '{"status":"ok"}';

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
