import { DateDataType } from 'sequelize';
import { Column, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Order extends Model {
  @Column
  @PrimaryKey
  id: number;

  @Column
  @NotNull
  carId: number;

  @Column({ defaultValue: 1 })
  @NotNull
  amount: number;

  @Column
  @NotNull
  startDate: DateDataType;

  @Column
  @NotNull
  endDate: DateDataType;
}