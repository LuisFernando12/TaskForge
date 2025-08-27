import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { IRepository } from './repository.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserRepository implements IRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  public async save(data: User) {
    try {
      return this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async findById(id: number) {
    try {
      return this.repository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async findAll() {
    try {
      return this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async update(data: User, id: number) {
    try {
      return this.repository.update(id, data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number) {
    try {
      return this.repository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
