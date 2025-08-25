import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

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
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: new Date().toISOString(),
  })
  createdAt: Date;
  @Column({ name: 'update_at', type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
