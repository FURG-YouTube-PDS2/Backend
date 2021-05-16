import { getRepository } from 'typeorm';
import Video from '../../models/Video';

interface Request {
	id: string;
}

global.atob = require('atob');
global.Blob = require('node-blob');
global.URL = require('url-polyfill');

class getVideoFileService {
	public async execute({ id }: Request): Promise<string> {
		const videoRepo = getRepository(Video);

		const video = await videoRepo.findOne({ select: ['file'], where: { id: id } });

		if (video !== undefined) {
			const url = video?.file;

			return url;
		}

		throw new Error();
	}
}

export default getVideoFileService;
