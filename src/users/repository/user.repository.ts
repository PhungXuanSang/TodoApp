import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/users.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private datasource: DataSource) {
    super(User, datasource.createEntityManager());
  }
  async createUser(): Promise<User> {
    const newUser = this.create({
      avatar: 'https://example.com/default-avatar.png',
    });
    return await this.save(newUser);
  }
  async findById(id: number): Promise<User | null> {
    return await this.findOne({ where: { id }, relations: ['auth'] });
  }
  async findUser() {
    return await this.find();
  }
}
