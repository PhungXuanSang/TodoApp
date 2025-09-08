import { User } from "src/users/entity/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 100 })
    title: string;
    @Column({ length: 500 })
    description: string;
    @Column({ default: "pending" })
    status: "pending"|"done";
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dueDate: Date;
    @Column({ default: false })
    isDeleted: boolean;


    @ManyToOne(() => User, user => user.todos)
        @JoinColumn({ name: 'userId' })
    user : User;

}