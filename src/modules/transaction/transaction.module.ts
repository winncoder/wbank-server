import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionController],
  providers: [TransactionService, UserService],
})
export class TransactionModule {}
