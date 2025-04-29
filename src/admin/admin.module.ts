/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/common/entities/book.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),  // Add Book model to the feature array
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
