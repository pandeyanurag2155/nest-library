/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/common/entities/book.model';
import { Order } from 'src/common/entities/order.model';
import{User} from '../user/entities/user.model'

@Module({
  imports:[SequelizeModule.forFeature([Book,Order,User])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
