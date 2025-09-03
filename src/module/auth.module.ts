import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/respository/user.repository';
import { AuthController } from '../controller/auth.controller';
import { User } from '../entity/user.entity';
import { AuthService } from '../service/auth.service';
import { EncryptService } from './../service/encrypt.service';
import { TokenModule } from './token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  controllers: [AuthController],
  providers: [UserRepository, EncryptService, AuthService],
})
export class AuthModule {}
