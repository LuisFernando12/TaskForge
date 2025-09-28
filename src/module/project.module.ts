import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from '../controller/project.controller';
import { Epic } from '../entity/epic.entity';
import { Project } from '../entity/project.entity';
import { Story } from '../entity/story.entity';
import { Task } from '../entity/task.entity';
import { EpicRepository } from '../respository/epic.repository';
import { ProjectRepository } from '../respository/project.repository';
import { StoryRepository } from '../respository/story.repository';
import { TaskRepository } from '../respository/task.repository';
import { AIService } from '../service/ai.service';
import { ProjectService } from '../service/project.service';
import { TrelloService } from '../service/trello.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Project, Epic, Story, Task])],
  controllers: [ProjectController],
  providers: [
    ProjectRepository,
    EpicRepository,
    StoryRepository,
    TaskRepository,
    JwtService,
    TrelloService,
    AIService,
    ProjectService,
  ],
})
export class ProjectModule {}
