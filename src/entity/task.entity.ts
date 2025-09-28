import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Story } from './story.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
  @ManyToOne(() => Story, (story) => story.tasks, { onDelete: 'CASCADE' })
  story: Story;
}
