import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { RestarurantSchema } from './schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestarurantSchema },
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
