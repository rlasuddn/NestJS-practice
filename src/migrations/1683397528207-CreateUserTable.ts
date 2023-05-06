import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1683397528207 implements MigrationInterface {
  name = 'CreateUserTable1683397528207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //User 테이블 생성 SQL 코드
    await queryRunner.query(
      `CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVertifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    //User 테이블을 삭제하는 SQL 코드
    await queryRunner.query(`DROP TABLE \`User\``);
  }
}
