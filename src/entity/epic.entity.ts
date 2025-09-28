import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Story } from './story.entity';

@Entity()
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  title: string;
  @OneToMany(() => Story, (story) => story.epic)
  stories: Story[];
  @ManyToOne(() => Project, (project) => project.epic)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
