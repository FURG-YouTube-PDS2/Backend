import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
}

class statisticChannelService {
	public async execute({ token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const user_id = checkJwt(token).sub;
			const today = new Date();
			const year = today.getFullYear();

			if (videoRepository && userRepository && userVideoRepository) {
				const videos_id = await userVideoRepository.find({
					select: ['video_id'],
					where: {
						user_id,
						is_owner: true,
					},
				});
				const users_id = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('user_id')
					.where('is_owner != true AND video_id IN (:videos_id)', { videos_id })
					.getRawMany();
				const female = await userRepository
					.createQueryBuilder('user')
					.select('gender')
					.where('gender = "f" AND id IN (:users_id)', { user_id })
					.getCount();
				const male = await userRepository
					.createQueryBuilder('user')
					.select('gender')
					.where('gender = "m" AND id IN (:users_id)', { user_id })
					.getCount();
				const others = await userRepository
					.createQueryBuilder('user')
					.select('gender')
					.where('gender = "o" AND id IN (:users_id)', { user_id })
					.getCount();

				const ten = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where('(today-birthdate) < 10 AND id IN (:users_id)', { user_id })
					.getCount();
				const thirteen = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where(
						'(today-birthdate) > 10 AND (today-birthdate) <= 13  AND id IN (:users_id)',
						{ user_id },
					)
					.getCount();
				const sixteen = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where(
						'(today-birthdate) > 13 AND (today-birthdate) < 17 AND id IN (:users_id)',
						{ user_id },
					)
					.getCount();
				const nineteen = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where(
						'(today-birthdate) > 16 AND (today-birthdate) < 20 AND id IN (:users_id)',
						{ user_id },
					)
					.getCount();
				const tw_four = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where(
						'(today-birthdate) >19 10 AND (today-birthdate) < 25 AND id IN (:users_id)',
						{ user_id },
					)
					.getCount();
				const tw_five = await userRepository
					.createQueryBuilder('user')
					.select('birthdate')
					.where('(today-birthdate) >25 10 AND id IN (:users_id)', { user_id })
					.getCount();

				return { status };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default statisticChannelService;
