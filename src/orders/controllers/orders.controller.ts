import { Controller, Delete, Get, Param, UnprocessableEntityException, ConflictException, Post, Body, Patch } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/order.model';
import { CarsService } from 'src/cars/services/cars.service';

@ApiTags('Orders Module')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders from the api'})
  @ApiResponse({
    status: 200,
    description: 'List of all the orders'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order from the api'})
  @ApiResponse({
    status: 200,
    description: 'Specific order from the api'
  })
  @ApiResponse({
    status: 404,
    description: 'No order with such an id'
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
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an order'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        carId: {
          type: 'uuid',
          example: '7fd0660b-9eba-4cbc-a769-3abea7202da6',
          description: 'This is a unique id of the car of the order'
        },
        amount: {
          type: 'integer',
          example: 5,
          description: 'This is a requested amount of cars',
          default: 1
        },
        startDate: {
          type: 'date',
          example: '2024-02-02',
          description: 'This is a date of the start of booking of the car(s)'
        },
        endDate: {
          type: 'date',
          example: '2024-02-013',
          description: 'This is a date of the end of booking of the car(s)'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Created an order'
  })
  @ApiResponse({
    status: 422,
    description: 'Incorect input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async createOne(@Body() order: Order) {
    const { carId, amount = 1, startDate, endDate } = order;

    if (!Number.isFinite(amount) || amount <= 0) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Amount of cars has to be a number bigger than 0' }
    );

    if (!startDate || !endDate) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Order need to have start and end date' }
    );

    if (new Date(startDate) > new Date(endDate)) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Date of the start of the booking have to be earlier than the one of the end' }
    );

    let carAmountAvailable = 0;
    try {
      let car = await this.carsService.findOne(carId);
      carAmountAvailable = car.amountAvailable;
    } catch (error) {
      throw new Error(error); 
    }

    const ordersForTheCar = await this.ordersService.findAllByCarId(carId);
    for (const order of ordersForTheCar) {
      const newOrderStartDate = new Date(startDate);
      const newOrderEndDate = new Date(endDate);
      const formatedNewOrderStart = Date.parse(`${newOrderStartDate.getFullYear()}-${String(newOrderStartDate.getMonth() + 1).padStart(2, '0')}-${String(newOrderStartDate.getDate()).padStart(2, '0')}`);
      const formatedNewOrderEnd = Date.parse(`${newOrderEndDate.getFullYear()}-${String(newOrderEndDate.getMonth() + 1).padStart(2, '0')}-${String(newOrderEndDate.getDate()).padStart(2, '0')}`);
      if ((Date.parse(order.startDate) <= formatedNewOrderStart && Date.parse(order.endDate) > formatedNewOrderStart)
        || (Date.parse(order.startDate) < formatedNewOrderEnd && Date.parse(order.endDate) >= formatedNewOrderEnd)) {
        carAmountAvailable -= order.amount;
      }
    }

    if (carAmountAvailable < amount) throw new ConflictException(
      'Not enough available cars',
      { description: 'There is not enough available cars for these dates' }
    );

    return this.ordersService.createOne(order);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit the order\'s properties'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        carId: {
          type: 'uuid',
          example: '7fd0660b-9eba-4cbc-a769-3abea7202da6',
          description: 'This is a unique id of the car of the order'
        },
        amount: {
          type: 'integer',
          example: 5,
          description: 'This is a requested amount of cars',
          default: 1
        },
        startDate: {
          type: 'date',
          example: '2024-02-02',
          description: 'This is a date of the start of booking of the car(s)'
        },
        endDate: {
          type: 'date',
          example: '2024-02-013',
          description: 'This is a date of the end of booking of the car(s)'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Edited the order'
  })
  @ApiResponse({
    status: 422,
    description: 'Incorect input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async editOne(@Param('id') id: string, @Body() orderToUpdate: Order) {
    const { carId, amount, startDate, endDate } = orderToUpdate;

    if (carId !== undefined) {
      try {
        await this.carsService.findOne(carId);
      } catch(error) {
        throw new Error(error);
      }
    }

    if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Amount of cars has to be a number bigger than 0' }
    );

    const oldOrder = await this.ordersService.findOne(id);

    if ((!endDate && Date.parse(startDate) > Date.parse(oldOrder.endDate))
      || (!startDate && Date.parse(endDate) < Date.parse(oldOrder.startDate))
      || (Date.parse(startDate) > Date.parse(endDate))) throw new UnprocessableEntityException(
      'Incorect input data',
      { description: 'Date of the start of the booking have to be earlier than the one of the end' }
    );

    let carAmountAvailable = 0;
    try {
      let car = await this.carsService.findOne(carId);
      carAmountAvailable = car.amountAvailable;
    } catch (error) {
      throw new Error(error); 
    }

    const ordersForTheCar = await this.ordersService.findAllByCarId(carId);
    for (const order of ordersForTheCar) {
      const newOrderStartDate = new Date(startDate);
      const newOrderEndDate = new Date(endDate);
      const formatedNewOrderStart = Date.parse(`${newOrderStartDate.getFullYear()}-${String(newOrderStartDate.getMonth() + 1).padStart(2, '0')}-${String(newOrderStartDate.getDate()).padStart(2, '0')}`);
      const formatedNewOrderEnd = Date.parse(`${newOrderEndDate.getFullYear()}-${String(newOrderEndDate.getMonth() + 1).padStart(2, '0')}-${String(newOrderEndDate.getDate()).padStart(2, '0')}`);
      if ((Date.parse(order.startDate) <= formatedNewOrderStart && Date.parse(order.endDate) > formatedNewOrderStart)
        || (Date.parse(order.startDate) < formatedNewOrderEnd && Date.parse(order.endDate) >= formatedNewOrderEnd)) {
        carAmountAvailable -= order.amount;
      }
    }

    if ((amount && carAmountAvailable < amount) || (!amount && carAmountAvailable < oldOrder.amount)) throw new ConflictException(
      'Not enough available cars',
      { description: 'There is not enough available cars for these dates' }
    );

    return this.ordersService.editOne(id, orderToUpdate);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the order'})
  @ApiResponse({
    status: 200,
    description: 'Deleted specific order from the api'
  })
  @ApiResponse({
    status: 404,
    description: 'No order with such an id'
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
    return this.ordersService.deleteOne(id);
  }
}
