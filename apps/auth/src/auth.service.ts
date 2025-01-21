import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { CreateUserDto } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';
import { plainToInstance } from 'class-transformer';
import { SerializedUserDto } from './user/dto/serialized-user.dto';
import { UserDocument } from './user/models/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private ConfigService: ConfigService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await argon2.hash(password);

    return await this.userService.createUser(email, hashedPassword);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const serializedUser = plainToInstance(SerializedUserDto, user, {
      excludeExtraneousValues: true,
    });

    return serializedUser;
  }

  async login(user: UserDocument, response: Response) {
    const payload = { email: user.email, sub: { userId: user.id } };

    const access_token = this.jwtService.sign(payload);

    const jwt_expiration = parseInt(this.ConfigService.get('JWT_EXPIRATION'));

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + jwt_expiration);

    response.cookie('Authorization', access_token, {
      expires,
      httpOnly: true,
    });
  }
}
