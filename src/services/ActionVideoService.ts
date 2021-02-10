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

			/// REVISAR GET USER
			// Get Video owner username
			// const userVideoOwner = await userVideoRepository.findOne({ where: { video_id, is_owner: true } });
			// const user_owner_id = userVideoOwner!.user_id
			// const videoOwner = await userRepository.findOne(user_owner_id);
			// const username = videoOwner!.username;
			// const avatar = videoOwner!.avatar;

			// // Count Comments
			// const comment_count = await commentRepository.count({ where: { video_id: video_id } });

			// Comment count with query builder
			// const comment_count = await commentRepository
			// 	.createQueryBuilder("comment")
			// 	.select("comment.id")
			// 	.where("comment.video_id = video_id")
			// 	.getCount();

			// Count Subscriptions
			// const subscriptions = await subscriptionRepository.count({ where: { user_target: user_owner_id } });

			// console.log(user_id);

			// Verify if user is subscribed in channel
			// const verifySubscribed = await subscriptionRepository
			// 	.findOne({
			// 		where: { user_subscriber: user_id, user_target: user_owner_id }
			// 	});
			// const is_subscribed = verifySubscribed ? true : false;

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
