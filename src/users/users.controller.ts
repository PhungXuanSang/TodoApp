import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.guard';
import { RoleGuard } from 'src/auth/strategies/role.guard';
import { Roles } from 'src/auth/strategies/roles.Decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/todos/common/decorators/getUser';
import { multerConfig } from 'src/config/multer.config';
import { unlink } from 'fs/promises';
import { join } from 'path';
@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
// @Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @Post()
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Hiển thị danh sách user' })
  async findAll() {
    return await this.usersService.findAll();
  }
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Hiển thị 1 user' })
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
  // @Patch(':id')
  // async update(@Param('id') id: number, @Body() userDto: UserDto) {
  //   return this.usersService.update(id, userDto);
  // }
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa user' })
  async remove(@Param('id') id: number) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Patch('avatar')
  @ApiOperation({ summary: 'upload avatar' })
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: { userId: number; avatar: string },
  ) {
    if (user.avatar) {
      const oldPath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'avatars',
        user.avatar,
      );
      try {
        await unlink(oldPath);
      } catch (err) {
        console.log('File không tồn tại hoặc lỗi xóa:', err);
      }
    }

    return this.usersService.updateAvatar(user.userId, file);
  }
  // @Put('avatar')
  // @UseInterceptors(FileInterceptor('avatar'))
  // async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
  //   const userId = req.user.userId; // Lấy từ JWT
  //   return this.usersService.updateAvatar(userId, { avatar: file.filename });
  // }
}
