const Koa = require('koa');
const cors = require('@koa/cors');
const k2c = require('koa2-connect');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = new Koa();
app.use(cors());
app.use(async (ctx, next) => {
  ctx.respond = false;
  await k2c(
    createProxyMiddleware({
      target: `http://127.0.0.1:5002`,
      changeOrigin: false,
      secure: false,
    })
  )(ctx, next);
  return await next();
});

app.listen(5003, () => console.log('Cors Server is works on port: 5003'));
