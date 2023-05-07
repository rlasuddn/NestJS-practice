import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  get() {
    console.log('hello');
  }

  async login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(
        jwtString,
        this.configService.get('JWT_SECRET'),
      ) as (jwt.JwtPayload | string) & User;

      const { id, email } = payload;
      return { userId: id, email };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
