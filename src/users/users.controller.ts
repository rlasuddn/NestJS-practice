import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  Inject,
  InternalServerErrorException,
  UseFilters,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserPipe } from './pipe/createUser.pipe';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from 'src/exception/exception-filter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user-commend';
import { GetUserInfoQuery } from './queries/user-info-query';

//특정 컨트롤러에 예외필터 적용
// @UseFilters(HttpExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,

    //WINSTON_MODULE_NEST_PROVIDER 토큰으로 Logger 객체 주입
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    //커맨드 주입
    private commandBus: CommandBus,
    //쿼리 주입
    private queryBus: QueryBus,
  ) {}

  //특정 엔드포인트에 예외필터 적용
  // @UseFilters(HttpExceptionFilter)
  @Get()
  printWinston() {
    throw new HttpException('hi', HttpStatus.BAD_GATEWAY);
    this.logger.error('error: ', { error: 'hi' });
    this.logger.warn('warn: ', { warn: 'hi' });
    this.logger.info('info: ', { info: 'hi' });
    this.logger.http('http: ', { http: 'hi' });
    this.logger.verbose('verbose: ', { verbose: 'hi' });
    this.logger.debug('debug: ', { debug: 'hi' });
    this.logger.silly('silly: ', { silly: 'hi' });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    // return await this.usersService.getUserInfo(userId); //유저 정보 응답

    const getUserInfoQuery = new GetUserInfoQuery(userId);
    return this.queryBus.execute(getUserInfoQuery);
  }

  @Post()
  async createUser(@Body(CreateUserPipe) dto: CreateUserDto): Promise<void> {
    // await this.usersService.createUser(dto);

    const command = new CreateUserCommand(dto.name, dto.email, dto.password);

    return this.commandBus.execute(command); //커맨드 전송
  }

  private printLoggerSerivce(dto: CreateUserDto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (error) {
      this.logger.error('error:' + JSON.stringify(dto), { stack: error.stack });
    }
    this.logger.warn('warn' + JSON.stringify(dto));
    this.logger.verbose('verbose' + JSON.stringify(dto));
    this.logger.debug('debug' + JSON.stringify(dto));
  }

  // @Post('email-verify')
  // async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
  //   return await this.usersService.verifyEmail(dto);
  // }

  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    return await this.usersService.login(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
