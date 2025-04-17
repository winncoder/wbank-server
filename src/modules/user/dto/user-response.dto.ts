import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty()
  readonly id: number;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Exclude()
  @ApiProperty()
  password: string;

  @Expose()
  @ApiProperty()
  balance: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  createdBy: string;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
  
  @Expose()
  @ApiProperty()
  updateBy: Date;

  @Expose()
  @ApiProperty()
  deleteAt: Date;

  @Expose()
  @ApiProperty()
  deleteBy: String;

}