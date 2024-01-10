import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './cars/models/car.model';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/models/order.model';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '192347',
      database: 'Booking',
      models: [Car, Order],
    }),
    CarsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
