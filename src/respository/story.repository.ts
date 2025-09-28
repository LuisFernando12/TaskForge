import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './../entity/story.entity';
import { IRepository } from './repository.interface';

export class StoryRepository implements IRepository<Story> {
  constructor(
    @InjectRepository(Story) private readonly repository: Repository<Story>,
  ) {}
  async save(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findById(id: number): Promise<Story> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: { tasks: true, epic: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll(): Promise<Story[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(
    data: Partial<Omit<Story, 'id' | 'createdAt' | 'updatedAt'>>,
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
