import { registerEnumType } from '@nestjs/graphql';

export enum GoodsType {
  PALLET = 'PALLET',
  BOX = 'BOX',
  COLLI = 'COLLI',
}

registerEnumType(GoodsType, {
  name: 'GoodsType',
  description: 'The type of goods beeing transported',
});
