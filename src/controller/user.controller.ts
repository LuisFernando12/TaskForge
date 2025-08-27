import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/createUser.dto';
import { UpdateUserDTO } from 'src/dto/updateUser.dto';
import { UserService } from 'src/service/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  public async createUser(@Body() user: CreateUserDTO) {
    return await this.userService.createUser(user);
  }
  @Get('/:id')
  public async getUser(@Param('id') id: number) {
    return await this.userService.getUser(id);
  }
  @Get()
  public async findAllUser() {
    return await this.userService.findAllUser();
  }
  @Put('/:id')
  public async upadateUser(
    @Body() user: UpdateUserDTO,
    @Param('id') id: number,
  ) {
    return await this.userService.updateUser(user, id);
  }
}
