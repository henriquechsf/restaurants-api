import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDTO } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<User> {
    const { name, email, password } = signUpDTO;

    const user = await this.userModel.create({
      name,
      email,
      password,
    });

    return user;
  }
}
