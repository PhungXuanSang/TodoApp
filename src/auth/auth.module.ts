import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { User } from 'src/users/entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategies/Jwt.strategy';
import { AuthRepository } from './repository/auth.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from 'src/users/repository/user.repository';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    jwtStrategy,
    LocalStrategy,
    {
      provide: AuthRepository,
      useFactory: (dataSource: DataSource) => new AuthRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [AuthService, AuthRepository, UserRepository],
})
export class AuthModule {}
