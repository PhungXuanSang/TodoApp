import {
  IsDateString,
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
  status: 'pending' | 'done';
  @IsOptional()
  @IsDateString()
  dueDate: string;
  isDeleted: boolean;
  userId: number;
}
