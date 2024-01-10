import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, underscored: true })
export class Car extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

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