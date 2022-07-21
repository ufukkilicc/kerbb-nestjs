import { IsString } from 'class-validator';

export class AuthRegisterDto {
	@IsString() readonly user_name: string;
	@IsString() readonly user_surname: string;
	@IsString() readonly user_email: string;
	@IsString() readonly user_password: string;
}
