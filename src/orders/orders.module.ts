import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';

@Module({
  providers: [OrdersService]
})
export class OrdersModule {}
