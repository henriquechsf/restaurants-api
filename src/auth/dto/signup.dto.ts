import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail({}, { message: 'Please enter correct email address' })
  @IsNotEmpty()
  readonly email: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
