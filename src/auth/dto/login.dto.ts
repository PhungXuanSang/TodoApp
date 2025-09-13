import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { AuthMessages } from '../constants/messages';
import { PASSWORD_REGEX } from '../constants/regex';

export class LoginDto {
  @IsNotEmpty({ message: AuthMessages.EMAIL_SHOULD_NOT_BE_EMPTY })
  @IsEmail({}, { message: AuthMessages.INVALID_EMAIL_FORMAT })
  email: string;
  @IsNotEmpty({ message: AuthMessages.PASSWORD_SHOULD_NOT_BE_EMPTY })
  @MinLength(6, {
    message: AuthMessages.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS_LONG,
  })
  @Matches(PASSWORD_REGEX, {
    message: AuthMessages.PASSWORD_MUST_CONTAIN,
  })
  password: string;
}
