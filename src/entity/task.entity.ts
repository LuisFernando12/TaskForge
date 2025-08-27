import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Project, (project) => project.id)
  project: Project;
  @Column()
  epic: string;
  @Column()
  description: string;
  @Column()
  status: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
