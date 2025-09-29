import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { AuthMessages } from './constants/messages';
import { AuthUser } from './common/authUser';
import { RefreshTokenPayload } from './common/RefreshTokenPayload';

@Injectable()
export class AuthService {
  async validateUser(email: string, pass: string) {
    const user = await this.authRepo.findByEmail(email);
    // const user = await this.authRepo.findOne({
    //   where: { email },
    // });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullname,
      role: user.role,
    };
  }
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}
  // check
  async register(dto: RegisterDto) {
    const existsEmail = await this.authRepo.findByEmail(dto.email);
    if (existsEmail) {
      throw new ConflictException(AuthMessages.EMAIL_SHOULD_NOT_BE_EMPTY);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const auth = await this.authRepo.createAuth(dto, hashedPassword);
    // auth.email = dto.email;
    // auth.password = hashedPassword;
    // auth.fullname = dto.fullname;

    const saveAuth = await this.authRepo.save(auth);

    const user = await this.userRepo.createUser();
    user.auth = saveAuth;
    await this.userRepo.save(user);
    return {
      auth,
      user,
    };
  }
  //
  login(user: AuthUser) {
    // const auth = await this.authRepo.findByEmail(dto.email);
    // if (!auth) {
    //   throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    // }

    // const isPasswordValid = await bcrypt.compare(dto.password, auth.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    // }
    const payload = { sub: user.id, email: user.email, role: user.role };

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      },
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
    console.log(payload);

    return { accessToken, refreshToken, message: AuthMessages.LOGIN_SUCCESS };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      // Tìm user từ DB theo userId trong refreshToken
      const user = await this.authRepo.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      // (Nếu bạn lưu refreshToken trong DB thì check thêm ở đây)
      // if (user.refreshToken !== refreshToken) {
      //   throw new UnauthorizedException('Invalid refresh token');
      // }

      // Tạo accessToken mới
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES,
        },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }
}
