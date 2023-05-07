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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserPipe } from './pipe/createUser.pipe';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string) {
    return await this.usersService.getUserInfo(userId); //유저 정보 응답
  }

  @Post()
  async createUser(@Body(CreateUserPipe) dto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(dto);
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
