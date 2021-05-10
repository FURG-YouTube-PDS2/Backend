import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';

interface Request {
	video_id: string;
}

interface Response {
	video_id: string;
	channel: string;
	title: string;
	thumb: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DescriptionVideoPService {
	public async execute({ video_id }: Request): Promise<Response> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			console.log(video_id);
			const video = await videoRepository.findOne({
				select: ['title', 'thumb'],
				where: { id: video_id },
			});
			console.log(video);

			if (videoRepository) {
				const user_owner = await userVideoRepository.findOne({
					where: { video_id, is_owner: true },
				});
				const user_id = user_owner?.user_id;

				const owner = await userRepository.findOne(user_id);

				var watchesQuery = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('SUM(user_videos.watches)', 'sum')
					.where('video_id = :video_id', { video_id })
					.getRawOne();
				var watches = watchesQuery.sum;
				return {
					video_id,
					channel: owner!.username,
					title: video!.title,
					thumb: video!.thumb,
				};
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DescriptionVideoPService;
