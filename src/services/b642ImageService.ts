import { getRepository } from 'typeorm';
import Video from '../models/Video';

interface Request {
	id: string;
}

global.atob = require('atob');
global.Blob = require('node-blob');
global.URL = require('url-polyfill');

class getImageService {
	public async execute({ id }: Request): Promise<string> {
		const videoRepo = getRepository(Video);

		const video = await videoRepo.findOne({ select: ['thumb'], where: { id: id } });

		if (video !== undefined) {
			const url = video?.thumb;

			return url;
		}

		throw new Error();
	}
}

export default getImageService;
