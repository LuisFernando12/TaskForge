import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  private salts: string;
  constructor() {
    this.salts = bcrypt.genSaltSync();
  }
  public async encripty(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salts);
  }
  public async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
