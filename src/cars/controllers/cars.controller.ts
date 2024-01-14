import { Controller, Get, Param, Delete, Post, Body, Patch, UnprocessableEntityException } from '@nestjs/common';
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

  @Post()
  createOne(@Body() car: Car) {
    const { model, price, amountAvailable = 1 } = car;
    if (!model || model.length < 3) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Model is absent or too short' },
    );

    if (!Number.isFinite(amountAvailable) || !Number.isFinite(price)) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Price and amount available have to be numbers' }
    );

    if (!price || price <= 0) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Price is absent or less than/equal to 0' }
    );

    if (amountAvailable <= 0) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Amount available cannot be less than/equal to 0' }
    );

    return this.carsService.createOne(car);
  }

  @Patch(':id')
  editOne(@Param('id') id: string, @Body() carToUpdate: Car) {
    const { model, price, amountAvailable } = carToUpdate;
    if (model && model.length < 3) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Model is absent or too short' },
    );

    if (amountAvailable !== undefined && !Number.isFinite(amountAvailable) || price && !Number.isFinite(price)) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Price and amount available have to be numbers' }
    );

    if (model && typeof model !== 'string') throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Model has to be of type string' }
    );

    if (price && price <= 0) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Price is absent or less than/equal to 0' }
    )

    if (amountAvailable && amountAvailable <= 0) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Amount available cannot be less than/equal to 0' }
    )

    return this.carsService.editOne(id, carToUpdate);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.carsService.deleteOne(id);
  }
}
