import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	video_id: string;
}

interface Response {
	video_id: string;
	owner_id: string;
	owner_nick: string;
	owner_avatar: string;
	all_subs: number;
	title: string;
	description: string;
	thumb: string;
	views: number;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DescriptionVideoService {
	public async execute({ video_id }: Request): Promise<Response> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const subscriptionRepository = getRepository(Subscription);

			const video = await videoRepository.findOne(video_id);

			if (videoRepository) {
				const user_owner = await userVideoRepository.findOne({
					where: { video_id, is_owner: true },
				});
				const user_id = user_owner?.user_id;

				const owner = await userRepository.findOne(user_id);
				// const subs = await subscriptionRepository.find({
				// 	where: { user_target: user_id },
				// });
				const subs = await subscriptionRepository.count({
					where: { user_target: user_id },
				});
				var watchesQuery = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('SUM(user_videos.watches)', 'sum')
					.where('video_id = :video_id', { video_id })
					.getRawOne();
				var watches = watchesQuery.sum;

				// const data = {
				// 	video_id,
				// 	owner_id: owner?.id,
				// 	owner_nick: owner?.username,
				// 	owner_avatar: owner?.avatar,
				// 	all_subs: subs,
				// 	title: video?.title,
				// 	description: video?.description,
				// 	thumb: video?.thumb,
				// };
				// console.log(data);
				return {
					video_id,
					owner_id: owner!.id,
					owner_nick: owner!.username,
					owner_avatar: owner!.avatar,
					all_subs: subs,
					title: video!.title,
					description: video!.description,
					thumb: video!.thumb,
					views: watches,
				};
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DescriptionVideoService;
