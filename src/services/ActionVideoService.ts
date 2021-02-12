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
			const commentRepository = getRepository(Comment);
			const subscriptionRepository = getRepository(Subscription);

			const user_id = checkJwt(token).sub;

			// const video = await videoRepository.findOne(video_id)
			// const user = await userRepository.findOne(user_id)

			const created_at = new Date();

			// Aqui temos video_id, title, file e description
			const videoUser = await userVideoRepository.findOne({ where: { video_id, user_id } });
			const is_owner = false,
				liked = 0;

			if (videoUser) {
				//Pq isso
				// Adicionar +1 em watch
				const { is_owner, liked } = videoUser;
			} else {
				const watches = 1;
				const reported = false,
					report_text = '',
					report_option = '';

				await userVideoRepository.save({
					video_id,
					user_id,
					is_owner,
					liked,
					watches,
					reported,
					report_text,
					report_option,
					created_at,
				});
			}
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
			};

			return videoData;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ActionVideoService;
