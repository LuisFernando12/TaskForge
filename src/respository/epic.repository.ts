import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from '../entity/epic.entity';
import { IRepository } from './repository.interface';

export class EpicRepository implements IRepository<Epic> {
  constructor(
    @InjectRepository(Epic) private readonly repository: Repository<Epic>,
  ) {}
  async save(data: Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findById(id: number): Promise<Epic> {
    try {
      return await this.repository.findOne({
        where: { id: id },
        relations: { stories: true, project: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll(): Promise<Epic[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(
    data: Partial<Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>>,
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
