/* eslint-disable prettier/prettier */
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/entities/user.model';
import { Book } from './book.model';

@Table({ timestamps: false })
export class Order extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @BelongsTo(() => Book)
  book: Book;

  @Column
  quantity: number;

  @Column
  issuedAt: Date;
}
