import { User } from "src/users/entity/users.entity";
import { Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Auth {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToOne(() => User, user => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

}