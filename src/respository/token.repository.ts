import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entity/token.entity';
import { IRepository } from './repository.interface';

export class TokenRepository implements IRepository<Token> {
  constructor(
    @InjectRepository(Token)
    private readonly repository: Repository<Token>,
  ) {}
  public async save(data: Omit<Token, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async findById(id: number) {
    try {
      return await this.repository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async findByUserId(userId: number) {
    try {
      return await this.repository.findOne({ where: { user: { id: userId } } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async existsByUserId(userId: number) {
    try {
      return await this.repository.existsBy({ user: { id: userId } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async existsToken(token: string) {
    try {
      return await this.repository.existsBy({ token });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async update(
    data: Partial<Omit<Token, 'id' | 'createdAt' | 'updatedAt'>>,
    id: number,
  ) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
