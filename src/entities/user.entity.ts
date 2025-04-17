import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Transform } from 'class-transformer';
import { Transaction } from './transaction.entity';

@Entity()
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Length(1, 255)
  @Transform(({ value }) => value.trim())
  @Column({ unique: true })
  username: string;

  @IsEmail()
  @Length(1, 255)
  @Column({ unique: true })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(1, 255)
  @Column()
  password: string;

  @Column('decimal', { precision: 12, scale: 2 })
  balance: string;

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toUser, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  receivedTransactions: Transaction[];

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
