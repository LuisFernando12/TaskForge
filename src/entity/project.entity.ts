import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ name: 'board_url' })
  boardUrl: string;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: new Date().toISOString(),
  })
  createdAt: Date;
  @Column({ name: 'updated_at', type: 'timestamp' })
  updateAt: Date;
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
