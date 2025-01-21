import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserDocument } from './user/models/user.schema';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Serialize } from './interceptors/serialize.interceptor';
import { SerializedUserDto } from './user/dto/serialized-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Serialize(SerializedUserDto)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: UserDocument, @Res() response: Response) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @Get()
  logOut() {
    //TODO: implement logout
    return 'logout';
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Serialize(SerializedUserDto)
  getMe(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'jwt-auth' })
  async handleMessage(@Payload() data: UserDocument) {
    return data;
  }
}
