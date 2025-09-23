import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { User } from 'src/entity/user.entity';
import { EncryptService } from 'src/service/encrypt.service';
import { UserService } from 'src/service/user.service';
import { UserRepository } from './../respository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserRepository, EncryptService, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
