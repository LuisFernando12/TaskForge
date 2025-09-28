import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { IProject } from '../service/ai.service';
import { ProjectService } from '../service/project.service';
import { IResponseCreateBoard } from '../service/trello.service';
interface ICreateProject {
  name: string;
  prompt: string;
}
@Controller('/project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Post('')
  async createProject(@Body() body: ICreateProject) {
    const board = await this.projectService.createProject(body.prompt);
    return board;
  }
  @Post('/board')
  async createBoard(
    @Body() project: IProject,
    @Request() req,
  ): Promise<IResponseCreateBoard> {
    const userId = req.user?.sub;
    const board = await this.projectService.createBoardProject(userId, project);
    return board;
  }
  @Get('/:id')
  async getProject(@Param('id') id: number, @Request() req) {
    const userId = req.user?.sub;
    const project = this.projectService.getProject(id, userId);
    return project;
  }
}
