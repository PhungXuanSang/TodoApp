import { DataSource, Repository } from 'typeorm';
import { Auth } from '../entity/auth.entity';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private datesource: DataSource) {
    super(Auth, datesource.createEntityManager());
  }
  async findByEmail(email: string): Promise<Auth | null> {
    return await this.findOne({ where: { email }, relations: ['user'] });
  }

  async createAuth(dto: RegisterDto, hashedPassword: string): Promise<Auth> {
    const newAuth = this.create({
      email: dto.email,
      password: hashedPassword,
      fullname: dto.fullname,
      role: 'user',
    });
    return await this.save(newAuth);
  }
  async findById(id: number): Promise<Auth | null> {
    return await this.findOne({ where: { id }, relations: ['user'] });
  }
}
