import { IsIn, IsOptional } from 'class-validator';
import { TodoMessages } from '../constants/todos.messages';

export class UpdateStatusDto {
  @IsOptional()
  @IsIn(['pending', 'done'], { message: TodoMessages.THE_STATUS_IS_INDICATED })
  status: 'pending' | 'done';
}
