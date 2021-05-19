import { Response as res } from 'express';
import { getRepository } from 'typeorm';
import Video from '../../models/Video';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	video_id: string;
}

class ExistVideoService {
	public async exists({ video_id }: Request): Promise<any> {
		try {
			const VideoRepo = getRepository(Video);
			if (VideoRepo) {
				const video = await VideoRepo.findOne({ select: ['id'], where: { id: video_id } });
				return video;
			} else {
				throw new Error('Erro ao resgatar repositÃ³rio.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ExistVideoService;
