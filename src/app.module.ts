import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './cars/schemas/car.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '192347',
      database: 'Booking',
      models: [Car],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
