import { AllowNull, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ timestamps: false, underscored: true })
export class Order extends Model {
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  carId: string;

  @AllowNull(false)
  @Column({ defaultValue: 1 })
  amount?: number;

  @AllowNull(false)
  @Column
  startDate: string;

  @AllowNull(false)
  @Column
  endDate: string;
}
