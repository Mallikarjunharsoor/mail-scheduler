import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class EmailJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  from!: string;

  @Column('simple-array')
  to!: string[];

  @Column({ nullable: true })
  recipient?: string;

  @Column()
  subject!: string;

  @Column('text')
  body!: string;

  @Column()
  sendAt!: Date;

  @Column({ default: 2 })
  delayBetweenSeconds!: number;

  @Column({ default: 200 })
  hourlyLimit!: number;

  @Column({ default: 'scheduled' })
  status!: 'scheduled' | 'sent' | 'failed';

  @Column({ nullable: true })
  ownerId?: string;

  @Column({ nullable: true })
  sentAt?: Date;

  @Column({ nullable: true })
  lastError?: string;

  @Column({ nullable: true, unique: true })
  queueJobId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
