import { IsDecimal, IsNotEmpty, MinLength } from 'class-validator';
import { GenderEnum } from '../../../common/enum/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The full name of the user', example: 'John Doe' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The email address of the user', example: 'john.doe@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The gender of the user', example: 'male' })
  gender: GenderEnum;
  
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'The password of the user (min 3 characters)', example: 'password123' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The balance of the user', example: '1000.00' })
  @IsDecimal()
  balance: string;
}