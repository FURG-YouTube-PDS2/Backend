import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Comment from '../../models/Comment';
import Subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	video_id: string;
	token: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DataVideoService {
	public async execute({ token, video_id }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);

			const video = await videoRepository.findOne(video_id);

			if (video) {
				const user_owner = await userVideoRepository.findOne({
					where: { video_id, is_owner: true },
				});
				const user_id = checkJwt(token).sub;

				if (user_id === user_owner?.user_id) {
					const data = {
						title: video?.title,
						description: video?.description,
						thumb: video?.thumb,
						privacy: video?.privacy,
					};
					// console.log(data);
					return data;
				} else {
					return { status: 0 };
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DataVideoService;
