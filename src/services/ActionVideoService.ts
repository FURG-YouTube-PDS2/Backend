import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import User from '../models/User';
import Comment from '../models/Comment';
import Subscription from '../models/Subscription';

import checkJwt from '../middlewares/checkJwt';

interface Request {
	video_id: string;
	token: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class ActionVideoService {
	public async execute({ video_id, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const subscriptionRepository = getRepository(Subscription);
			if (token !== '') {
				const user_id = checkJwt(token).sub;
			} else {
				const user_id = 'random';
			}

			// Aqui temos video_id, title, file e description
			const videoUser = await userVideoRepository.findOne({ where: { video_id, user_id } });
			const is_owner = false;

			if (videoUser) {
				//Pq isso
				// Adicionar +1 em watch
				const { is_owner, liked, reported } = videoUser;
				var wat = videoUser.watches + 1;
				await userVideoRepository.save({
					id: videoUser.id,
					user_id,
					watches: wat,
				});
			} else {
				const created_at = new Date();
				const watches = 1;
				const reported = false,
					report_text = '',
					report_option = '';

				await userVideoRepository.save({
					video_id,
					user_id,
					is_owner,
					liked: 0,
					watches,
					reported,
					report_text,
					report_option,
					created_at,
				});
			}
			// console.log('liked: ' + liked);
			// A partir daqui temos is_owner e liked

			// Get watches, query return [ { sum: valor } ]
			const watchesQuery = await userVideoRepository
				.createQueryBuilder('user_videos')
				.select('SUM(user_videos.watches)', 'sum')
				.getRawOne();
			const watches = watchesQuery.sum;

			// Count Likes
			const likes = await userVideoRepository
				.createQueryBuilder('user_videos')
				.select('user_videos.liked')
				.where('user_videos.liked = 1')
				.getCount();

			// Count Dislikes
			const dislikes = await userVideoRepository
				.createQueryBuilder('user_videos')
				.select('user_videos.liked')
				.where('user_videos.liked = -1')
				.getCount();

			// AINDA FALTA AVATAR
			const videoData = {
				watches,
				likes,
				dislikes,
				liked,
				reported,
			};
			// console.log(videoData);

			return videoData;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ActionVideoService;
