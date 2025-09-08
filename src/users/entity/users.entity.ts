import { time, timeStamp } from "console";
import { create } from "domain";
import e from "express";
import { UserRole } from "./user.role";
import { Column, Entity, OneToMany, OneToOne,PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "src/auth/entity/auth.entity";
import { Todo } from "src/todos/entity/todo.entity";
@Entity()
export class User {
   @PrimaryGeneratedColumn()
    id : number;
    @Column({ unique: true })
    email : string;
    // @Column()
    // password : string;
    @Column({ nullable: true })
    fullname : string;
    @Column({ nullable: true })
    avatar : string;
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role : UserRole;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt : Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt : Date;  

   
  @OneToOne(() => Auth, auth => auth.user)
  auth: Auth;
  @OneToMany(( ) => Todo, (todo) => todo.user)
  todos:Todo[];
}
