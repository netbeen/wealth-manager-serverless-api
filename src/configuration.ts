import { ILifeCycle } from '@midwayjs/core';
import { join } from 'path';
import * as typegoose from '@midwayjs/typegoose';
import { Configuration, App } from '@midwayjs/decorator';
import { Application } from '@midwayjs/faas';
import * as cache from '@midwayjs/cache'; // 导入cacheComponent模块

@Configuration({
  imports: [
    typegoose, // 加载 typegoose 组件
    cache, // 导入 cache 组件
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
      await next();
    });
  }
}
