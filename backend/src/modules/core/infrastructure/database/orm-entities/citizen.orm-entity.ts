import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '@shared/database/base.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'citizens' })
@Index('UQ_citizens_user_id', ['userId'], { unique: true })
@Index('UQ_citizens_cpf_active', ['cpf'], { unique: true, where: '"deleted_at" IS NULL' })
export class CitizenOrmEntity extends BaseOrmEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'FK_citizens_user' })
  user?: UserOrmEntity;

  @Column({ type: 'varchar', length: 11 })
  cpf!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;
}
