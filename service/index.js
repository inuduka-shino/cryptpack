/* static-page index.js */
/*eslint-env node */
/*eslint no-console: off */

const path = require('path'),
      Koa = require('koa'),
      serv = require('koa-static');

const app = new Koa();

// static resource
app.use(serv(path.join(__dirname, 'static/'), {
  index: 'main.html',
  extensions: ['html']
}));

module.exports = app;
