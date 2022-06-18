import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/auth/schemas/user.schema';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async getAllRestaurants(
    @Query() query: ExpressQuery,
    @CurrentUser() user: User,
  ): Promise<Restaurant[]> {
    console.log(user);
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDTO,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDTO,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const foundRestaurant = await this.restaurantsService.findById(id);

    if (foundRestaurant.user.toString() !== user.id.toString()) {
      throw new ForbiddenException('You can not update this restaurant.');
    }

    return this.restaurantsService.updateById(id, updateRestaurantDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async deleteRestaurant(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.findById(id);

    if (restaurant.user.toString() !== user.id.toString()) {
      throw new ForbiddenException('You can not update this restaurant.');
    }

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

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    const restaurant = await this.restaurantsService.findById(id);

    if (restaurant.user.toString() !== user.id.toString()) {
      throw new ForbiddenException('You can not update this restaurant.');
    }

    return await this.restaurantsService.uploadImages(id, files);
  }
}
