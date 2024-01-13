import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../models/order.model';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findByPk(id);
    if (order) return order;
    throw new NotFoundException('Not found', {
      description: 'There is no order with such an id'
    })
  }

  async createOne(order: Order) {
    return this.orderModel.create({ ...order, id: uuidv4()});
  }

  async deleteOne(id: string) {
    const wasDeleted = await this.orderModel.destroy({ where: { id } });
    if (wasDeleted) return { status: 201, message: 'Succesfully deleted the order' };
    throw new NotFoundException('Not found', {
      description: 'There is no order with such an id'
    })
  }
}
