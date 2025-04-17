import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromUser = await queryRunner.manager.findOne(User, {
        where: { id: dto.fromUserId },
      });

      const toUser = await queryRunner.manager.findOne(User, {
        where: { id: dto.toUserId },
      });

      if (!fromUser || !toUser) {
        throw new NotFoundException('User not found');
      }

      const amount = parseFloat(dto.amount);

      if (parseFloat(fromUser.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      fromUser.balance = (parseFloat(fromUser.balance) - amount).toFixed(2);
      toUser.balance = (parseFloat(toUser.balance) + amount).toFixed(2);

      const transaction = this.transactionRepo.create({
        ...dto,
        fromUser,
        toUser,
      });

      await queryRunner.manager.save(fromUser);
      await queryRunner.manager.save(toUser);
      const savedTransaction = await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Transaction successful',
        transaction: savedTransaction,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
