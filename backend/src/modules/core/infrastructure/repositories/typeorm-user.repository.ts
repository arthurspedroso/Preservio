import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOrmEntity } from '../database/orm-entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const saved = await this.repo.save(UserMapper.toOrmEntity(user));
    return UserMapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.repo.findOne({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.repo.findOne({ where: { email } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async update(user: User): Promise<User> {
    const saved = await this.repo.save(UserMapper.toOrmEntity(user));
    return UserMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete({ id });
  }
}
