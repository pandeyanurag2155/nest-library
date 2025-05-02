/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { raw } from 'mysql2';
import { Where } from 'sequelize/types/utils';
import { Book } from 'src/common/entities/book.model';
import { Order } from 'src/common/entities/order.model';
import { User } from './entities/user.model';
import * as bcrypt from 'bcrypt'; 
import { sendLowStockAlert } from 'src/grpc/notification.client';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Book) private bookModel: typeof Book,   //  Book model (for create/find)
        @InjectModel(Order) private orderModel: typeof Order, //  Order model
        @InjectModel(User) private userModel: typeof User,
      ) {}

      async onModuleInit() {
        await this.createDefaultAdmin();
    }

    private async createDefaultAdmin() {
        const userCount = await this.userModel.count();
        if (userCount === 0) {
            const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
            if (!adminPassword) {
                console.error('ADMIN_DEFAULT_PASSWORD is not set in .env');
                return;
            }

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await this.userModel.create({
                name: 'Admin',
                address: 'Default Address',
                email: 'admin@lib.com',
                password: hashedPassword,
                role: 'ADMIN',
            });

            console.log(' Default Admin created successfully');
        }
    }

      

    async getAllBooks(): Promise<Book[]> {
        return this.bookModel.findAll();
      }

    async borrowBook(borrowDto:{bookId:number;quantity:number}, userId: number){
         const {bookId,quantity}=borrowDto;

        const book=await this.bookModel.findByPk(bookId,{raw:true});
        console.log("****",book)

        
         if(!book) throw new Error('Book not found')

          if (book.quantity ===0) {
            sendLowStockAlert(bookId, book.name);
          }
          if (book.quantity < quantity) throw new Error('Not enough quantity available');

         console.log(book.quantity)
         // Decrease book quantity
         book.quantity -= quantity;
         console.log(book.quantity)
         await this.bookModel.update({quantity:book.quantity}, {
          where: {
            id:book.id 
          }
         });

        //  if (book.quantity === 0) {
        //   sendLowStockAlert(bookId, book.name);
        // }

          const updatedBook = await this.bookModel.findByPk(bookId,{raw:true})

        //  await this.bookModel.sequelize?.query(
        //     `UPDATE books SET quantity = quantity - :quantity WHERE id = :bookId`,
        //     {
        //       replacements: { quantity, bookId },
        //       type: 'UPDATE',
        //     },
        //   );
        console.log(`Book after save:`, updatedBook);
     
         // Create an order
         await this.orderModel.create({
           userId,
           bookId,
           quantity,
           issuedAt: new Date(),
         });
     
         return { message: 'Book borrowed successfully' };
      }

      async returnBook(returnDto:{bookId:number,quantity:number},userId:number){
        const {bookId,quantity}=returnDto;
       //Find order for the specific user and book
        const order=await this.orderModel.findOne({where:{userId,bookId},raw:true})
 
        // if no book is found
        if(!order){
          return {success:false,message:'No such book found in your orders'}
        }

        if(order.quantity<quantity){
            return {success:false, message:'not borrow that many books'}
        }

        order.quantity-=quantity;
        if(order.quantity===0){
          await this.orderModel.destroy({where:{id:order.id}})
        }else{
          await this.orderModel.update({quantity:order.quantity},{
          where:{
            id:order.id
          }
        });
        }
        

        //Find the book and increase the available quantity
        const book=await this.bookModel.findOne({
          where:{id:bookId},
          raw:true
        })
           console.log(book)
        if(book){
          book.quantity+=quantity;
          await this.bookModel.update({quantity:book.quantity},{
            where:{
              id:book.id
            }
          })
        }else {
          return { success: false, message: 'Book not found' };
        }
        return { success: true, message: 'Books returned successfully' };
      }
}
