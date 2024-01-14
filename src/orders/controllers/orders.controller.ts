import { Controller, Delete, Get, Param, UnprocessableEntityException, ConflictException, Post, Body, Patch } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/order.model';
import { CarsService } from 'src/cars/services/cars.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly carsService: CarsService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
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
  deleteOne(@Param('id') id: string) {
    return this.ordersService.deleteOne(id);
  }
}
