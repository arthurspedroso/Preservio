import { Citizen } from '../../domain/entities/citizen.entity';
import { CitizenOrmEntity } from '../database/orm-entities/citizen.orm-entity';

export class CitizenMapper {
  static toDomain(record: CitizenOrmEntity): Citizen {
    return Citizen.reconstitute({
      id: record.id,
      userId: record.userId,
      cpf: record.cpf,
      phone: record.phone,
    });
  }

  static toOrmEntity(citizen: Citizen): CitizenOrmEntity {
    const entity = new CitizenOrmEntity();
    entity.id = citizen.id;
    entity.userId = citizen.userId;
    entity.cpf = citizen.cpf;
    entity.phone = citizen.phone;
    return entity;
  }
}
