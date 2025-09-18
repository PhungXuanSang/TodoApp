import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TodoMessages } from '../constants/todos.messages';

export class TodoDto {
  @IsString()
  @IsNotEmpty({ message: TodoMessages.TODO_SHOULD_NOT_BE_EMPTY })
  title: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsIn(['pending', 'done'], { message: TodoMessages.THE_STATUS_IS_INDICATED })
  status: 'pending' | 'done';
  @IsOptional()
  @IsDateString()
  dueDate: string;
  isDeleted: boolean;
  userId: number;
}
