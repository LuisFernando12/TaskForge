import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { IRepository } from './repository.interface';

export class ProjectRepository implements IRepository<Project> {
  constructor(
    @InjectRepository(Project) private readonly repository: Repository<Project>,
  ) {}
  async save(
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Project> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findById(id: number): Promise<Project> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: { epic: { stories: { tasks: true } }, user: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll(): Promise<Project[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(
    data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>,
    id: number,
  ) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async delete(id: number) {
    try {
      return await this.repository.delete({ id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
