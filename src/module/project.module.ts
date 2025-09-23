import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProjectController } from '../controller/project.controller';
import { AIService } from '../service/ai.service';
import { ProjectService } from '../service/project.service';
import { TrelloService } from '../service/trello.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [ProjectController],
  providers: [JwtService, TrelloService, AIService, ProjectService],
})
export class ProjectModule {}
