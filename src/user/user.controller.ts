/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get,Post,Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { Roles } from 'src/common/roles.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Get('books')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('USER')
    getAllBooks(){
        return this.userService.getAllBooks();
    }

    @Post('orders')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles('USER')
    borrowBook(@Body() borrowDto: { bookId: number; quantity: number },@Req() req) {
       const userId=req.user.userId;
       console.log("******************",userId)
        return this.userService.borrowBook(borrowDto,userId);
}
   @Post('order/return')
   @UseGuards(AuthGuard('jwt'),RolesGuard)
   @Roles('USER')
   returnBook(@Body() returnDto:{bookId:number;quantity:number},@Req() req){
     const userId=req.user.userId;
     return this.userService.returnBook(returnDto,userId)
   }

}
