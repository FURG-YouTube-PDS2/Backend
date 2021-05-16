import { getRepository } from 'typeorm';
import User from '../models/User';
import checkJwt from '../middlewares/checkJwt';

interface Request {
	token: string;
}

global.atob = require('atob');
global.Blob = require('node-blob');
global.URL = require('url-polyfill');

class getYAvatarService {
	public async execute({ token }: Request): Promise<string> {
		const id = checkJwt(token).sub;
		const userRepo = getRepository(User);

		const user = await userRepo.findOne({ select: ['avatar'], where: { id: id } });

		if (user !== undefined) {
			const url = user?.avatar;

			return url;
		}

		throw new Error();
	}
}

export default getYAvatarService;
