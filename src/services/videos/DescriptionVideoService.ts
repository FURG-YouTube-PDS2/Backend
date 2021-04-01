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

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DescriptionVideoService {
	public async execute({ video_id }: Request): Promise<object> {
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

				const data = {
					video_id,
					owner_id: owner?.id,
					owner_nick: owner?.username,
					owner_avatar: owner?.avatar,
					all_subs: subs,
					title: video?.title,
					description: video?.description,
					thumb: video?.thumb,
				};
				// console.log(data);
				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DescriptionVideoService;
