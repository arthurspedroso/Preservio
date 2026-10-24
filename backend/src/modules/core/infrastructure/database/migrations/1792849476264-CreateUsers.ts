import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class CreateUsers1792849476264 implements MigrationInterface {
  name = 'CreateUsers1792849476264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'password_hash', type: 'varchar', length: '100' },
        ],
        indices: [
          {
            name: 'UQ_users_email_active',
            columnNames: ['email'],
            isUnique: true,
            where: '"deleted_at" IS NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
