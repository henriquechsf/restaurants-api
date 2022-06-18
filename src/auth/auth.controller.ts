import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDTO: SignUpDTO): Promise<User> {
    return this.authService.signUp(signUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDTO: LoginDTO): Promise<User> {
    return this.authService.login(loginDTO);
  }
}
