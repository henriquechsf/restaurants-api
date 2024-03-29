import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { Meal } from './schemas/meal.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
  ) {}

  async findAll(): Promise<Meal[]> {
    return await this.mealModel.find();
  }

  async findByRestaurant(id: string): Promise<Meal[]> {
    return await this.mealModel.find({ restaurant: id });
  }

  async create(meal: Meal, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    // Saving meal ID in the restaurant menu
    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found with this ID.');
    }

    // Check ownership of the restaurant
    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot add meal to this restaurant.');
    }

    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated.id);
    await restaurant.save();

    return mealCreated;
  }

  async findById(id: string): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose ID error');
    }

    const meal = await this.mealModel.findById(id);

    if (!meal) {
      throw new NotFoundException('Meal not found with this ID.');
    }

    return meal;
  }

  async updateById(id: string, meal: Meal): Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const res = await this.mealModel.findByIdAndDelete(id);

    if (res) return { deleted: true };
    return { deleted: false };
  }
}
