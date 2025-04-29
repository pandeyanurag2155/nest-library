/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Order } from './order.model';

@Table({ timestamps: false })
export class Book extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column
  name: string;

  @Column
  author: string;

  @Column
  description: string;

  @Column(DataType.INTEGER)
  quantity: number;

  @HasMany(() => Order)
  orders: Order[];
    static get: any;
}
