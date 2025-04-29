/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from 'src/common/entities/book.model';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Book) private bookModel: typeof Book) {}

  async addOrUpdateBook(createBookDto: CreateBookDto): Promise<{ book: Book; isNew: boolean}> {
    const { name, author, description, quantity } = createBookDto;

    const existingBook = await this.bookModel.findOne({
      where: { name, author },
     
    });

    console.log(existingBook);
    console.log(quantity);

    if (existingBook) {
      // If the book already exists, update the quantity
      // Access and update the quantity property correctly
      const currentQuantity = existingBook.get('quantity') as number;
      await existingBook.update({ 
        quantity: currentQuantity + quantity 
      });
      
      return { book: existingBook, isNew: false };
    }

    // Create a new book if it doesn't exist
    const newBook = await this.bookModel.create({
      name,
      author,
      description,// Note: Fixed typo in field name if your DB column is "description"
      quantity,
    });
    
    return { book: newBook, isNew: true };
  }

  async getAllBooks(): Promise<Book[]> {
    return this.bookModel.findAll();
  }
}