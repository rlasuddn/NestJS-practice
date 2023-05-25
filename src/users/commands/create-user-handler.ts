import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user-commend';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { ulid } from 'ulid';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity) //유저 저장소 주입
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async execute(command: CreateUserCommand) {
    const userExist = await this.checkUserExists(command.email);

    if (userExist)
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );

    const signupVerifyToken = uuid.v1();
    await this.saveUserUsingTransaction(command, signupVerifyToken);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user !== null;
  }

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
}
