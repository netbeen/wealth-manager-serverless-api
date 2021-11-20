import { ILifeCycle } from '@midwayjs/core';
import { join } from 'path';
import * as typegoose from '@midwayjs/typegoose';
import { Configuration, App } from '@midwayjs/decorator';
import { Application } from '@midwayjs/faas';
// import * as cors from '@koa/cors';

@Configuration({
  imports: [
    typegoose, // 加载 typegoose 组件
  ],
  importConfigs: [join(__dirname, './config/')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {
    this.app.use(async (ctx, next) => {
      ctx.logger.info(`[${ctx.req.method}] ${ctx.req.url}`);
      // console.log(ctx.req.headers)
      await next();
    });
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', "*");
      ctx.set('Access-Control-Allow-Headers', Object.keys(ctx.req.headers).join(','));
      // ctx.set('Access-Control-Allow-Headers', 'access-control-allow-origin,content-type,x-jwt-token');
      ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
      ctx.set('Access-Control-Max-Age', '86400');
      // if(ctx.req.url === '/user/login3'){
      //   // ctx.set("Content-Type": "application/json");
      // }
      // if(ctx.req.method === 'OPTIONS'){
      //   console.log('OPTIONS in');
      //   ctx.res.status = 200
      //   return;
      // }
      await next();
    });
  }
}
