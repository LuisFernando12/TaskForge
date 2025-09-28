import { Task } from 'src/entity/task.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Epic } from './epic.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column('text', { name: 'acceptance_criteria', array: true })
  acceptanceCriteria: string[];
  @OneToMany(() => Task, (task) => task.story)
  tasks: Task[];
  @ManyToOne(() => Epic, (epic) => epic.stories)
  epic: Epic;
}
