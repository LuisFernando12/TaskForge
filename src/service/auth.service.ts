import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/respository/user.repository';
import { EncryptService } from './encrypt.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService,
    private readonly tokenService: TokenService,
  ) {}
  public async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException();
    }
    const userDB = await this.userRepository.findByEmail(email);
    if (!this.encryptService.compare(password, userDB.password)) {
      throw new UnauthorizedException();
    }
    return await this.tokenService.generateToken({
      sub: userDB.id,
      username: userDB.email,
    });
  }
}
