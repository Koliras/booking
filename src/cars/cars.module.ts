import { Module } from '@nestjs/common';
import { CarsController } from './controllers/cars.controller';
import { CarsService } from './services/cars.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './schemas/car.model';

@Module({
  imports: [SequelizeModule.forFeature([Car])],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
