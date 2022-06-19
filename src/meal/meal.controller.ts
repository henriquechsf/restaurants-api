import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { CreateMealDTO } from './dto/create-meal.dto';
import { UpdateMealDTO } from './dto/update-meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schemas/meal.schema';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  @Get()
  async getAllMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get('/:id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findById(id);
  }

  @Get('restaurant/:id')
  async getMealByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findByRestaurant(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createMeal(
    @Body() createMealDto: CreateMealDTO,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateMeal(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDTO,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    const meal = await this.mealService.findById(id);

    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot update this meal.');
    }

    return this.mealService.updateById(id, updateMealDto);
  }
}
