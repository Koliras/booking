import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { Order } from './models/order.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersController } from './controllers/orders.controller';
import { CarsModule } from 'src/cars/cars.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [SequelizeModule.forFeature([Order]), CarsModule]
})
export class OrdersModule {}
