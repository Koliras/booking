import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, underscored: true })
export class Order extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  carId: number;

  @AllowNull(false)
  @Column({ defaultValue: 1 })
  amount?: number;

  @AllowNull(false)
  @Column
  startDate: Date;

  @AllowNull(false)
  @Column
  endDate: Date;
}
