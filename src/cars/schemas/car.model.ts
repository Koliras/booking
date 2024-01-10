import { Column, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Car extends Model {
  @Column
  @PrimaryKey
  id: number;

  @Column
  @NotNull
  model: string;

  @Column({ defaultValue: 1 })
  @NotNull
  amountAvailable: number;

  @Column
  @NotNull
  price: number;
}