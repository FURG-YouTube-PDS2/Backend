import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
	id: string;
}

global.atob = require('atob');
global.Blob = require('node-blob');
global.URL = require('url-polyfill');

class getAvatarService {
	public async execute({ id }: Request): Promise<string> {
		const userRepo = getRepository(User);

		const user = await userRepo.findOne({ select: ['avatar'], where: { id: id } });

		if (user !== undefined) {
			const url = user?.avatar;

			return url;
		}

		throw new Error();
	}
}

export default getAvatarService;
