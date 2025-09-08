import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';
import { User } from 'src/users/entity/users.entity';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

   async validateUser(email: string, password: string) : Promise<any> {
      const user =await  this.authRepo.findOne({
        where: { email},
      });
      if(!user) return null;

      const isPasswordValid =  bcrypt.compare(password, user.password);
      if(!isPasswordValid) return null; 
      
      return user;
    }
 constructor(
    @InjectRepository(Auth) 
    private authRepo: Repository<Auth>,
    @InjectRepository(User) 
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  // check
    async register(dto: RegisterDto) {
            const existingUser = await this.userRepo.findOneBy ({email : dto.email})
            if(existingUser){
                throw new Error('User already exists');
            }

       const user = this.userRepo.create({fullname : dto.fullname, email : dto.email});
         await this.userRepo.save(user);

         const hashedPassword = await bcrypt.hash(dto.password, 10);

         const auth = this.authRepo.create({
            email : dto.email,
            password : hashedPassword,
            role : dto.role || 'user',
            user : user
           
         });
          console.log('Hashed Password:', hashedPassword);
         await this.authRepo.save(auth);
        return { message: 'Register successful', email: user.email, fullname: user.fullname };
        
    }
    //
    async login(dto: LoginDto) {
    const auth = await this.authRepo.findOne({
        where: { email: dto.email },
        relations: ['user'],
      });
      if (!auth) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, auth.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      const payload = { sub: auth.id, email: auth.email, role: auth.role };
      
             const refreshToken = this.jwtService.sign({sub: auth.id}, {
            secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecretKey',
            expiresIn: '1d' });


      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'defaultSecretKey',
        expiresIn: '1h' });

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
      return { accessToken, refreshToken };
            
    }


}
