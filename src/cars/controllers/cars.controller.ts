import { Controller, Get, Param, Delete, Post, Body, Patch, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CarsService } from '../services/cars.service';
import { Car } from '../models/car.model';

@ApiTags('Cars Module')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars from the api'})
  @ApiResponse({
    status: 200,
    description: 'List of all the cars'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  findAll(): Promise<Car[]> {
    return this.carsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific car from the api'})
  @ApiResponse({
    status: 200,
    description: 'Specific car from the api'
  })
  @ApiResponse({
    status: 404,
    description: 'No car with such an id'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  @ApiParam({
    name: 'id',
    type: 'uuid',
    description: 'Unique id',
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a car'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          example: '2024 Acura Integra',
          description: 'This is a name of the car'
        },
        amountAvailable: {
          type: 'integer',
          example: 5,
          description: 'This is total amount of available cars of this model',
          default: 1
        },
        price: {
          type: 'number',
          example: 100,
          description: 'This is the price for 1 day of using the car'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Created a car'
  })
  @ApiResponse({
    status: 422,
    description: 'Incorect input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
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
  @ApiOperation({ summary: 'Edit the car\'s properties'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          example: '2024 Acura Integra',
          description: 'This is a name of the car',
        },
        amountAvailable: {
          type: 'integer',
          example: 5,
          description: 'This is total amount of available cars of this model',
          default: 1
        },
        price: {
          type: 'number',
          example: 100,
          description: 'This is the price for 1 day of using the car'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Edited the car'
  })
  @ApiResponse({
    status: 422,
    description: 'Incorect input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
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
  @ApiOperation({ summary: 'Delete the car'})
  @ApiResponse({
    status: 200,
    description: 'Deleted specific car from the api'
  })
  @ApiResponse({
    status: 404,
    description: 'No car with such an id'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  @ApiParam({
    name: 'id',
    type: 'uuid',
    description: 'Unique id',
    required: true,
  })
  deleteOne(@Param('id') id: string) {
    return this.carsService.deleteOne(id);
  }
}
