import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';

interface Request {
	user_id: string;
}

// interface Response {
// 	token: string;
// }

class GetToken {
	public async execute({ user_id }: Request): Promise<string> {
		const { secret, expiresIn } = authConfig.jwt;
		const token = sign({}, secret, {
			subject: user_id,
			expiresIn,
		});

		return token;
	}
}

export default GetToken;
