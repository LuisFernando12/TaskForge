import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';
import { IRepository } from './repository.interface';

export class TaskRepository implements IRepository<Task> {
  constructor(
    @InjectRepository(Task) private readonly repository: Repository<Task>,
  ) {}
  async save(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findById(id: number): Promise<Task> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: { story: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll(): Promise<Task[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.mesage);
    }
  }
  async update(
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
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
      return await this.repository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
