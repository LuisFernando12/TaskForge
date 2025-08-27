import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/createUser.dto';
import { UpdateUserDTO } from 'src/dto/updateUser.dto';
import { User } from 'src/entity/user.entity';
import { UserRepository } from 'src/respository/user.repository';
import { EncryptService } from './encrypt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService,
  ) {}
  public async createUser(user: CreateUserDTO) {
    user.password = await this.encryptService.encripty(user.password);
    return await this.userRepository.save(user as User);
  }
  public async getUser(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid request, missing ID !');
    }
    return await this.userRepository.findById(id);
  }
  public async findAllUser() {
    return this.userRepository.findAll();
  }
  public updateUser(user: UpdateUserDTO, id: number) {
    if (!id) {
      throw new BadRequestException('Invalid request, missing ID !');
    }
    return this.userRepository.update(user as User, id);
  }
}
