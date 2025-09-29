import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthMessages } from './constants/messages';
import { AuthRoutes } from './constants/routes';
import { ResponseDto } from './dto/response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './common/authUser';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(AuthRoutes.REGISTER)
  @HttpCode(201)
  @ApiOperation({ summary: 'Đăng ký' })
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
  @UseGuards(AuthGuard('local'))
  @Post(AuthRoutes.LOGIN)
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng Nhập' })
  login(@Request() req: { user: AuthUser }) {
    return this.authService.login(req.user);
  }
  // async login(@Body() dto: LoginDto) {
  //   const token = await this.authService.login(dto);
  //   return {
  //     token,
  //     message: AuthMessages.LOGIN_SUCCESS,
  //   };
  // }
  @Post('refresh')
  @ApiOperation({ summary: 'lấy lại accessToken' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
