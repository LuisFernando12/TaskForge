import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entity/project.entity';
import { Task } from 'src/entity/task.entity';
import { User } from 'src/entity/user.entity';
import { AppController } from '../controller/app.controller';
import { Token } from '../entity/token.entity';
import { AppService } from '../service/app.service';
import { AuthModule } from './auth.module';
import { ProjectModule } from './project.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task_forge',
      entities: [User, Project, Task, Token],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
