import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDTO } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<{ token: string }> {
    const { name, email, password } = signUpDTO;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

      return { token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicated email entered.');
      }
    }
  }

  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const { email, password } = loginDTO;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

    return { token };
  }
}
