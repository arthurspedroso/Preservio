import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserOrmEntity } from '../database/orm-entities/user.orm-entity';

export class UserMapper {
  static toDomain(record: UserOrmEntity): User {
    return User.reconstitute({
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.passwordHash,
      role: record.role as UserRole,
    });
  }

  static toOrmEntity(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.role = user.role;
    return entity;
  }
}
