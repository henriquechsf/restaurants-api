import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Restaurant } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    return await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
  }

  async create(restaurant: Restaurant): Promise<Restaurant> {
    const location = await APIFeatures.getRestaurantLocation(
      restaurant.address,
    );

    const data = Object.assign(restaurant, { location });

    return await this.restaurantModel.create(data);
  }

  async findById(id: string): Promise<Restaurant> {
    this.validateObjectId(id);

    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
    this.validateObjectId(id);

    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Restaurant> {
    this.validateObjectId(id);

    return await this.restaurantModel.findByIdAndDelete(id);
  }

  async uploadImages(id, files) {
    this.validateObjectId(id);

    const images = await APIFeatures.upload(files);

    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images as Object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return restaurant;
  }

  private validateObjectId(id: string): void {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(
        'Wrong mongoose ID Error. Please enter correct ID.',
      );
    }
  }
}
