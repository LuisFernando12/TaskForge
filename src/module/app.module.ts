import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { Task } from 'src/entity/task.entity';
import { User } from 'src/entity/user.entity';
import { AppController } from '../controller/app.controller';
import { Epic } from '../entity/epic.entity';
import { Story } from '../entity/story.entity';
import { Token } from '../entity/token.entity';
import { AppService } from '../service/app.service';
import { AuthModule } from './auth.module';
import { ProjectModule } from './project.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.getOrThrow<string>('DB_TYPE') as any,
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [User, Project, Epic, Story, Task, Token],
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
