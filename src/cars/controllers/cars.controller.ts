import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CarsService } from '../services/cars.service';
import { Car } from '../models/car.model';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(): Promise<Car[]> {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.carsService.deleteOne(id);
  }
}
