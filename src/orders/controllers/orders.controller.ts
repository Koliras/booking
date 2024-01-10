import { Controller, Delete, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/order.model';
import { Request } from 'express';

// @ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  createOne(@Body() order: Order) {
    return this.ordersService.createOne(order);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.ordersService.deleteOne(id);
  }
}
