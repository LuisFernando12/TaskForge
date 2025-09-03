import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ name: 'token_trello' })
  trelloToken: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;
  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
  @OneToOne(() => Token, (token) => token.user, { cascade: true })
  token: Token;
}
