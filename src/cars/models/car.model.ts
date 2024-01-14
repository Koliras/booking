import { AllowNull, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, underscored: true })
export class Car extends Model {
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  model: string;

  @AllowNull(false)
  @Column({ defaultValue: 1 })
  amountAvailable: number;

  @AllowNull(false)
  @Column
  price: number;
}