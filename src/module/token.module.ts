import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../entity/token.entity';
import { TokenRepository } from '../respository/token.repository';
import { TokenService } from '../service/token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get('SECRET'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
