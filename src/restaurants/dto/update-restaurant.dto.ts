import { User } from 'aws-sdk/clients/budgets';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';

export class UpdateRestaurantDTO {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEmail({}, { message: 'Please enter correct email' })
  @IsOptional()
  readonly email: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  readonly phone: string;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsEnum(Category, { message: 'Please enter correct category' })
  @IsOptional()
  readonly category: Category;

  @IsEmpty({ message: 'You cannot provide the user ID.' })
  readonly user: User;
}
