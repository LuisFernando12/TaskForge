import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user.entity';
import { TokenRepository } from '../respository/token.repository';

@Injectable()
export class TokenService {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  private generateExpireAt(): number {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    const expireAt = date.setSeconds(date.getSeconds() + 60);
    return expireAt;
  }

  private async saveToken(token: string, userId: number, experiesAt: Date) {
    if (!(await this.tokenRepository.existsByUserId(userId))) {
      const tokenDB = await this.tokenRepository.save({
        token,
        user: { id: userId } as User,
        expireAt: experiesAt,
      });
      return { access_token: tokenDB.token };
    }
    const tokenDB = await this.tokenRepository.findByUserId(userId);
    const updateTokenDB = await this.tokenRepository.update(
      { token },
      tokenDB.id,
    );
    if (updateTokenDB.affected === 0) {
      throw new InternalServerErrorException();
    }
    return { access_token: token };
  }
  async generateToken(payload: {
    sub: number;
    username: string;
  }): Promise<any> {
    try {
      const expireAt = this.generateExpireAt();
      const token = await this.jwtService.signAsync(payload);
      return await this.saveToken(token, payload.sub, new Date(expireAt));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async decodeToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
