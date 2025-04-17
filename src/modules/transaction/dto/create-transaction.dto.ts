import { IsUUID, IsNumberString } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @IsNumberString()
  amount: string;
}
