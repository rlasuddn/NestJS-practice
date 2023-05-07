import * as uuid from 'uuid';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity) //유저 저장소 주입
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private readonly authService: AuthService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const userExist = await this.checkUserExists(dto.email);
    if (userExist)
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );

    const signupVerifyToken = uuid.v1();
    await this.saveUserUsingTransaction(dto, signupVerifyToken);

    // await this.sendMemberJoinEmail(dto.email, signupVerifyToken);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user !== null;
  }

  //QueryRunner을 이용한 트랜잭션
  private async saveUserUsingQueryRunner(
    dto: CreateUserDto,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner(); //QueryRunner 객체 생성

    await queryRunner.connect(); //QueryRunner에서 DB에 연결 후 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      user.signupVertifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      throw new InternalServerErrorException();

      await queryRunner.commitTransaction(); //DB 작업을 수행한 후 커밋하여 영속화
    } catch (error) {
      //위 과정에서 에러 발생시 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      //직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();
    }
  }

  //transaction 메서드를 이용한 트랜잭션
  private async saveUserUsingTransaction(
    dto: CreateUserDto,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = dto.name;
      user.email = dto.email;
      user.password = dto.password;
      user.signupVertifyToken = signupVerifyToken;

      await manager.save(user);
      // throw new InternalServerErrorException('트랜잭션 오류');
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    console.log(signupVerifyToken);
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async login(dto: UserLoginDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email, password: dto.password },
    });

    if (!user.signupVertifyToken)
      throw new NotFoundException('유저가 존재하지 않습니다.');

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
