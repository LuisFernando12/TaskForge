import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Project } from '../entity/project.entity';
import { User } from '../entity/user.entity';
import { EpicRepository } from '../respository/epic.repository';
import { ProjectRepository } from '../respository/project.repository';
import { StoryRepository } from '../respository/story.repository';
import { TaskRepository } from './../respository/task.repository';
import { AIService, IProject } from './ai.service';
import { IResponseCreateBoard, TrelloService } from './trello.service';
import { UserService } from './user.service';
@Injectable()
export class ProjectService {
  constructor(
    private readonly trelloService: TrelloService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly aiService: AIService,
    private readonly projectRepository: ProjectRepository,
    private readonly epicRepository: EpicRepository,
    private readonly storyRepository: StoryRepository,
    private readonly taskRepository: TaskRepository,
  ) {}
  async createProject(prompt: string): Promise<IProject> {
    try {
      const project: IProject = await this.aiService.executePrompt(prompt);
      return project;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ? error.message : error,
      );
    }
  }
  async createBoardProject(
    userId: number,
    project: IProject,
  ): Promise<IResponseCreateBoard & { projectId: number }> {
    try {
      const userDB = await this.userService.getUser(userId);
      if (!userDB) {
        throw new UnauthorizedException();
      }
      const tokenTrello = userDB.trelloToken;
      const apiKeyTrello = this.configService.getOrThrow('API_KEY_TRELLO');
      const board = await this.trelloService.createBoard(
        project.project,
        tokenTrello,
        apiKeyTrello,
      );
      const [projectId, backlogList] = await Promise.all([
        this.saveProject(userId, project, board.url),
        this.trelloService.createListOnBoard(
          'Backlog',
          board.id,
          apiKeyTrello,
          tokenTrello,
          1,
        ),
        this.trelloService.createListOnBoard(
          'Todo',
          board.id,
          apiKeyTrello,
          tokenTrello,
          2,
        ),
        this.trelloService.createListOnBoard(
          'Doing',
          board.id,
          apiKeyTrello,
          tokenTrello,
          3,
        ),
        this.trelloService.createListOnBoard(
          'Blocked',
          board.id,
          apiKeyTrello,
          tokenTrello,
          4,
        ),
        this.trelloService.createListOnBoard(
          'Done',
          board.id,
          apiKeyTrello,
          tokenTrello,
          5,
        ),
      ]);
      if (
        !project ||
        !Array.isArray(project.epics) ||
        project.epics.length < 1
      ) {
        throw new BadRequestException('Invalid payload !');
      }

      for (const epic of project.epics) {
        const epicLabel = await this.trelloService.createLabelOnBoard(
          board.id,
          epic.title,
          'purple',
          apiKeyTrello,
          tokenTrello,
        );
        for (const story of epic.stories) {
          const storyCard = await this.trelloService.createCardOnList(
            story.title,
            backlogList.id,
            `**Critérios de aceite:**\n\n${story.acceptance_criteria.map((c: string) => `- ${c}`).join('\n\n')}`,
            apiKeyTrello,
            tokenTrello,
          );
          await this.trelloService.addLabelOnCard(
            storyCard.id,
            epicLabel.id,
            apiKeyTrello,
            tokenTrello,
          );
          const checkilistId = await this.trelloService.createCheckilistOncard(
            storyCard.id,
            'tasks',
            apiKeyTrello,
            tokenTrello,
          );
          for (const task of story.tasks) {
            await this.trelloService.createCheckitemOnChecklist(
              checkilistId,
              task,
              apiKeyTrello,
              tokenTrello,
            );
          }
        }
      }

      return {
        id: board.id,
        projectId,
        ...board,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  private async saveProject(
    userId: number,
    project: IProject,
    boardUrl: string,
  ): Promise<number> {
    try {
      if (
        !project ||
        !Array.isArray(project.epics) ||
        project.epics.length < 1
      ) {
        throw new BadRequestException('Invalid payload !');
      }
      const projectDB = await this.projectRepository.save({
        user: { id: userId } as User,
        title: project.project,
        level: project.level,
        description: project.description,
        boardUrl: boardUrl,
      } as Project);
      for (const epic of project.epics) {
        epic.project = projectDB;
        const epicDB = await this.epicRepository.save(epic);
        for (const story of epic.stories) {
          story.epic = epicDB;
          const storyDB = await this.storyRepository.save({
            acceptanceCriteria: story.acceptance_criteria,
            ...story,
          });
          for (const task of story.tasks) {
            await this.taskRepository.save({
              story: storyDB,
              description: task,
            });
          }
        }
      }
      return projectDB.id;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getProject(projectId: number, userId: number): Promise<Project> {
    const projectDB = await this.projectRepository.findById(projectId);
    if (!projectDB) {
      throw new NotFoundException('Project not found !');
    }
    if (projectDB.user.id != userId) {
      throw new UnauthorizedException();
    }
    delete projectDB.user;
    return projectDB;
  }
}
