import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Post()
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDTO,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }

  @Get('/:id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put('/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDTO,
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id);
    return this.restaurantsService.updateById(id, restaurant);
  }
}
