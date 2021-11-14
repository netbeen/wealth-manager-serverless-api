import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import { fetchUnitPriceByIdentifier } from 'fund-tools';

@Provide()
export class IndexHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'get',
  })
  async handleHTTPEvent(@Query() name = 'midwayjs') {
    console.log(
      (await fetchUnitPriceByIdentifier('160119')).map(
        item => `${item.date.format()} ${item.price}`
      )
    );
    return `Hello ${name}`;
  }
}
