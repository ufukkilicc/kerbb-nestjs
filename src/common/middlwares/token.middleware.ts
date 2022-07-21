import {
	BadRequestException,
	Injectable,
	NestMiddleware,
	RequestTimeoutException,
	UnauthorizedException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		const auth_json_webtoken = req.headers.authorization;
		if (req.baseUrl !== '/auth/login') {
			if (!auth_json_webtoken) {
				throw new BadRequestException('Token was not found');
			} else {
				try {
					const user = jwt.verify(
						auth_json_webtoken.slice(7, auth_json_webtoken.length),
						process.env.JWT_TEXT
					);
					if (user) {
						req['user'] = user;
						next();
					} else {
						throw new RequestTimeoutException('Token has expired');
					}
				} catch (error) {
					throw new UnauthorizedException(`error:${error}`);
				}
			}
		} else {
			next();
		}
	}
}
