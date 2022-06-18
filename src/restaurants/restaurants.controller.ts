import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllRestaurants(
    @Query() query: ExpressQuery,
    @CurrentUser() user: User,
  ): Promise<Restaurant[]> {
    console.log(user);
    return this.restaurantsService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDTO,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDTO,
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id);
    return this.restaurantsService.updateById(id, restaurant);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.findById(id);

    const imageDeteled = await this.restaurantsService.deleteImages(
      restaurant.images,
    );

    if (!imageDeteled) {
      return {
        deleted: false,
      };
    }

    const restaurantDeleted = this.restaurantsService.deleteById(id);

    if (!restaurantDeleted) {
      return {
        deleted: false,
      };
    }

    return {
      deleted: false,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.findById(id);

    return await this.restaurantsService.uploadImages(id, files);
  }
}
