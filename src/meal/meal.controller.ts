import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { CreateMealDTO } from './dto/create-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createMeal(
    @Body() createMealDto: CreateMealDTO,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }
}
