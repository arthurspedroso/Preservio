import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Citizen } from '../../domain/entities/citizen.entity';
import { User } from '../../domain/entities/user.entity';
import { CitizenRepository } from '../../domain/repositories/citizen.repository';
import { CitizenOrmEntity } from '../database/orm-entities/citizen.orm-entity';
import { UserOrmEntity } from '../database/orm-entities/user.orm-entity';
import { CitizenMapper } from '../mappers/citizen.mapper';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmCitizenRepository implements CitizenRepository {
  constructor(
    @InjectRepository(CitizenOrmEntity)
    private readonly repo: Repository<CitizenOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createWithUser(user: User, citizen: Citizen): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(UserOrmEntity, UserMapper.toOrmEntity(user));
      await manager.save(CitizenOrmEntity, CitizenMapper.toOrmEntity(citizen));
    });
  }

  async findByUserId(userId: string): Promise<Citizen | null> {
    const record = await this.repo.findOne({ where: { userId } });
    return record ? CitizenMapper.toDomain(record) : null;
  }

  async findByCpf(cpf: string): Promise<Citizen | null> {
    const record = await this.repo.findOne({ where: { cpf } });
    return record ? CitizenMapper.toDomain(record) : null;
  }
}
