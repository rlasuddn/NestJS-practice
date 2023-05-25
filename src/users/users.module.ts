import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './commands/create-user-handler';
import { GetUserInfoQueryHandler } from './queries/user-info-handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, CqrsModule], //유저 모듈 내에서 사용할 저장소 등록
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    CreateUserHandler,
    GetUserInfoQueryHandler,
  ],
})
export class UsersModule {}
