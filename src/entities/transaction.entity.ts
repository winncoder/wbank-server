import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: string;

    @ManyToOne(() => User, (user) => user.sentTransactions)
    @JoinColumn({ name: 'fromUserId', referencedColumnName: 'id' })
    fromUser: User;

    @ManyToOne(() => User, (user) => user.receivedTransactions)
    @JoinColumn({ name: 'toUserId', referencedColumnName: 'id' })
    toUser: User;
    
    constructor(transaction: Partial<Transaction>) {
        super();
        Object.assign(this, transaction);
      }
}