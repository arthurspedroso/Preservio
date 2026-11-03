import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class CreateCitizens1793046109668 implements MigrationInterface {
  name = 'CreateCitizens1793046109668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'citizens',
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
          { name: 'user_id', type: 'uuid' },
          { name: 'cpf', type: 'varchar', length: '11' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
        ],
        indices: [
          { name: 'UQ_citizens_user_id', columnNames: ['user_id'], isUnique: true },
          {
            name: 'UQ_citizens_cpf_active',
            columnNames: ['cpf'],
            isUnique: true,
            where: '"deleted_at" IS NULL',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_citizens_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('citizens');
  }
}
