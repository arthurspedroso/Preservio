import { Column, Entity, Index } from 'typeorm';
import { BaseOrmEntity } from '@shared/database/base.orm-entity';

@Entity({ name: 'users' })
@Index('UQ_users_email_active', ['email'], { unique: true, where: '"deleted_at" IS NULL' })
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 100, name: 'password_hash' })
  passwordHash!: string;
}
