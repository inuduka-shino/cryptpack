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
  const servFnc = serv(
                  path.join(__dirname, 'static/'), {
                    index: 'main.html',
                    extensions: ['html']
                  }
                );

  await servFnc(ctx, next);
});

module.exports = app;
