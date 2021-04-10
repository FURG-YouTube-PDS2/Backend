import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	video_id: string;
}

class DeleteVideoService {
	public async execute({ video_id }: Request): Promise<object> {
		try {
			const UserVideoRepo = getRepository(UserVideo);
			const VideoRepo = getRepository(Video);
			if (VideoRepo) {
				await VideoRepo.delete({
					id: video_id,
				});
				await UserVideoRepo.delete({
					video_id,
				});
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DeleteVideoService;
