import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class UpdateMealDTO {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  readonly price: number;

  @IsEnum(Category, { message: 'Please enter correct category for this meal.' })
  @IsOptional()
  readonly category: Category;

  @IsString()
  @IsOptional()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
