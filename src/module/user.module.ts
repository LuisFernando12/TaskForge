import { UserRepository } from './../respository/user.repository';
import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { UserService } from 'src/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [User, UserRepository, UserService],
})
export class UserModule {}
