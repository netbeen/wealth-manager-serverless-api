import { ILifeCycle } from '@midwayjs/core';
import { join } from 'path';
import * as typegoose from '@midwayjs/typegoose';
import * as cors from '@koa/cors';
import { Configuration, App, Config, ALL } from '@midwayjs/decorator';
import { Application } from '@midwayjs/faas';

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
  @Config(ALL)
  allConfig;

  async onReady() {
    this.app.use(
      cors({
        origin: 'http://127.0.0.1:5001',
      })
    );
  }
}
