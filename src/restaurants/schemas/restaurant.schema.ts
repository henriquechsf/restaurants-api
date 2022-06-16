import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  FAST_FOOD = 'Fast food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema()
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[];
}

export const RestarurantSchema = SchemaFactory.createForClass(Restaurant);
