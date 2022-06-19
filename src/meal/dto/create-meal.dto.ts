import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class CreateMealDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsEnum(Category, { message: 'Please enter correct category for this meal.' })
  @IsNotEmpty()
  readonly category: Category;

  @IsString()
  @IsNotEmpty()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
