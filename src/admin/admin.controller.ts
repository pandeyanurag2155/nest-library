/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpStatus, Post, UseGuards,Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import {Response} from 'express'
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('admin')

export class AdminController {
    constructor( private readonly adminService:AdminService){}

    @UseGuards(JwtAuthGuard,RolesGuard) 
    @Roles('ADMIN') //only users with 'admin' role can access this route
    @Post('books')
    async addBook(@Body() createBookDto: CreateBookDto ,@Res() res: Response){
        const result=await this.adminService.addOrUpdateBook(createBookDto)
        if (result.isNew) {
            return res.status(HttpStatus.CREATED).json(result.book);
          } else {
            return res.status(HttpStatus.OK).json(result.book);
          }
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('ADMIN') 
    @Get('books')
    getBooks(){
        return this.adminService.getAllBooks();
    }
}
