import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { User } from 'src/users/entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategies/Jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]), 
    JwtModule.register({
      global : true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
