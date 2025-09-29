import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MessagesAdmin } from './constants/messages';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Auth } from 'src/auth/entity/auth.entity';
import { User } from 'src/users/entity/users.entity';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authRepo = app.get(DataSource).getRepository(Auth);
  const userRepo = app.get(DataSource).getRepository(User);
  const adminExists = await authRepo.findOne({
    where: { email: process.env.EMAIL_SUPER_ADMIN },
  });
  if (adminExists) {
    console.log(MessagesAdmin.CHECK_EMAIL);
  }
  const hashedPassSuperAdmin = await bcrypt.hash(
    process.env.PASSWORD_SUPER_ADMIN!,
    10,
  );
  const superAdmin = authRepo.create({
    email: process.env.EMAIL_SUPER_ADMIN,
    password: hashedPassSuperAdmin,
    fullname: process.env.FULLNAME_SUPER_ADMIN,
    role: process.env.ROLE_SUPER_ADMIN,
  });
  console.log('Creating super admin object:', superAdmin);
  await authRepo.save(superAdmin);

  const superAdminUser = userRepo.create({
    auth: superAdmin,
    avatar: MessagesAdmin.AVATAR,
  });
  await userRepo.save(superAdminUser);
  console.log('Super admin saved!');
  await app.close();
  process.exit(0);
}
runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
