import { IsString } from 'class-validator';

export class AuthLoginDto {
	@IsString() readonly user_email: string;
	@IsString() readonly user_password: string;
}
