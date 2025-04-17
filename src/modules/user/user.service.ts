import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserParams } from './dto/getList_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { Order } from 'src/common/enum/enum';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/responsePaginate';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  findOneByEmail(email: string): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User(createUserDto);
      await this.entityManager.save(user);
      return { user, message: 'Successfully created user' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email or username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(params: GetUserParams) {
    const users = this.usersRepository
      .createQueryBuilder('user')
      .select(['user'])
      .skip(params.skip)
      .take(params.take)
      .orderBy('user.createdAt', Order.DESC);
    const [result, total] = await users.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    const userDtos = plainToInstance(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponsePaginate(userDtos, pageMetaDto, 'Success');
  }

  async findOneById(id: string) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user'])
        .where('user.id = :id', { id })
        .getOne();

      if (!user) throw new NotFoundException('User not found');
      const userDtos = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
      return userDtos;
    }
    catch (error) {
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user'])
      .where('user.username = :username', { username })
      .getOne();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('User not found');
      
      user.username = updateUserDto.username;
      user.password = updateUserDto.password;
      user.email = updateUserDto.email;
      user.balance = updateUserDto.balance;
      await this.entityManager.save(user);


      const userDtos = plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
      return { userDtos, message: 'Successfully update semester' };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Email or username already exists');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user'])
        .where('user.id = :id', { id })
        .getOne();
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      await this.usersRepository.softDelete(id);
      return { data: null, message: 'User deletion successful' };
      
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
  
}
