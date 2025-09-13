import { IsNotEmpty, IsString } from 'class-validator';
import { TodoMessages } from '../constants/todos.messages';

export class TodoDto {
  @IsString()
  @IsNotEmpty({ message: TodoMessages.TODO_SHOULD_NOT_BE_EMPTY })
  title: string;
  @IsString()
  description: string;
  status: 'pending' | 'done';
  dueDate: Date;
  isDeleted: boolean;
  userId: number;
}
