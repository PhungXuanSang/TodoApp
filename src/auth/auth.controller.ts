import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthMessages } from './constants/messages';
import { AuthRoutes } from './constants/routes';
import { ResponseDto } from './dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(AuthRoutes.REGISTER)
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    const reg = await this.authService.register(dto);
    const { ...authSafe } = reg.auth;

    const response: ResponseDto = {
      id: reg.user.id,
      email: authSafe.email,
      fullname: authSafe.fullname,
      avatar: reg.user.avatar,
      role: authSafe.role,
      userid: reg.user.id,
      createdAt: reg.user.createdAt,
      updatedAt: reg.user.updatedAt,
    };
    return {
      message: AuthMessages.REGISTER_SUCCESS,
      data: response,
    };
  }

  @Post(AuthRoutes.LOGIN)
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const token = await this.authService.login(dto);
    return {
      token,
      message: AuthMessages.LOGIN_SUCCESS,
    };
  }
}
