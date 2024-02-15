import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;
}
