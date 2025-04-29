/* eslint-disable prettier/prettier */
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Order } from '../../common/entities/order.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Table({ timestamps: false })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column
  name: string;

  @Column
  address: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column({ type: DataType.ENUM('ADMIN', 'USER') })
  role: UserRole;

  @HasMany(() => Order)
  orders: Order[];
}
