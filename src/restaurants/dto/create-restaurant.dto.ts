import { User } from 'aws-sdk/clients/budgets';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEmail({}, { message: 'Please enter correct email' })
  @IsNotEmpty()
  readonly email: string;

  @IsPhoneNumber('BR')
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsEnum(Category, { message: 'Please enter correct category' })
  @IsNotEmpty()
  readonly category: Category;

  @IsEmpty({ message: 'You cannot provide the user ID.' })
  readonly user: User;
}
