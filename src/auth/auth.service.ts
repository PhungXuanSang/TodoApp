import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Auth } from 'typeorm';

import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { AuthMessages } from './constants/messages';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.authRepo.findOne({
      where: { email },
    });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
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
  async login(dto: LoginDto) {
    const auth = await this.authRepo.findByEmail(dto.email);
    if (!auth) {
      throw new NotFoundException(AuthMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, auth.password);
    if (!isPasswordValid) {
      throw new NotFoundException(AuthMessages.INVALID_CREDENTIALS);
    }
    const payload = { sub: auth.id, email: auth.email, role: auth.role };

    const refreshToken = this.jwtService.sign(
      { sub: auth.id },
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

    return { accessToken, refreshToken };
  }
}
