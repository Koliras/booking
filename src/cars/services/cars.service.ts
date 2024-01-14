import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Car } from '../models/car.model';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car)
    private carModel: typeof Car,
  ) {}

  async findAll(): Promise<Car[]> {
    return this.carModel.findAll();
  }

  async findOne(id: string) {
    const order = await this.carModel.findByPk(id);
    if (order) return order;
    throw new NotFoundException('Not found', {
      description: 'There is no car with such an id'
    })
  }

  async createOne({ model, price, amountAvailable }: Car) {
    return this.carModel.create({ model, price, amountAvailable, id: uuidv4()});
  }

  async editOne(id: string, { model, price, amountAvailable }: Car) {
    const wasUpdated = await this.carModel.update({ model, price, amountAvailable }, { where: { id } });
    if (wasUpdated) return { status: 201, message: 'Succesfully updated the car' };
    throw new NotFoundException('Not found', {
      description: 'There is no car with such an id',
    })
  }

  async deleteOne(id: string) {
    const wasDeleted = await this.carModel.destroy({ where: { id } });
    if (wasDeleted) return { status: 201, message: 'Succesfully deleted the car' };
    throw new NotFoundException('Not found', {
      description: 'There is no car with such an id',
    })
  }
}
