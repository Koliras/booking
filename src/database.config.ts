import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfig implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService){}

  createSequelizeOptions() {
    return this.configService.get('database');
  }
}