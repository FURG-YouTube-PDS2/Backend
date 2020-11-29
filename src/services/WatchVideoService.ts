import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import User from '../models/User';
import Comment from '../models/Comment';
import Subscription from '../models/Subscription';

import checkJwt from '../middlewares/checkJwt'
import { verify } from 'crypto';

interface Request {
	video_id: string;
	token: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class WatchVideoService {
	public async execute({ video_id, token }: Request): Promise<object> {
		try {

			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const commentRepository = getRepository(Comment);
			const subscriptionRepository = getRepository(Subscription);


			const user_id = checkJwt(token).sub;

			const video = await videoRepository.findOne(video_id)
			const user = await userRepository.findOne(user_id)

			const created_at = new Date();

			// Aqui temos video_id, title, file e description
			if (video && user) {
				const videoUser = await userVideoRepository.findOne({ where: { video_id, user_id } });
				const is_owner = false, liked = 0;

				if (videoUser) {
					const { is_owner, liked } = videoUser;
				} else {
					const watches = 1;
					const reported = false, report_text = "", report_option = "";

					await userVideoRepository.save({
						video_id,
						user_id,
						is_owner,
						liked,
						watches,
						reported,
						report_text,
						report_option,
						created_at
					})
				}

				// Get watches, query return [ { sum: valor } ]
				const watchesQuery = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("SUM(user_videos.watches)", "sum")
					.getRawMany()
				const watches = watchesQuery[0].sum;

				// Count Likes
				const likes = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("user_videos.liked")
					.where("user_videos.liked = 1")
					.getCount();

				// Count Dislikes
				const dislikes = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("user_videos.liked")
					.where("user_videos.liked = -1")
					.getCount();


				// Get Video owner username
				const userVideoOwner = await userVideoRepository.findOne({ where: { video_id, is_owner: true } });
				const videoOwner = await userRepository.findOne(userVideoOwner!.user_id);
				const username = videoOwner!.first_name.concat(" ", videoOwner!.last_name);

				// Count Comments
				const comment_count = await commentRepository
					.createQueryBuilder("comment")
					.select("comment.id")
					.where("comment.video_id = video_id")
					.getCount();

				// Count Subscriptions
				const subscriptions = await subscriptionRepository
					.createQueryBuilder("subscription")
					.select("subscription.id")
					.where("subscription.user_id2 = userVideoOwner.user_id")
					.getCount();

				const verifySubscribed = await subscriptionRepository
					.findOne({
						where: { user_id1: user_id, user_id2: userVideoOwner!.user_id }
					})

				const is_subscribed = verifySubscribed ? true : false;

				// AINDA FALTA AVATAR
				const pageData = {
					video_id,
					description: video.description,
					file: video.file,
					title: video.title,
					watches,
					likes,
					dislikes,
					is_subscribed,
					subscriptions,
					comment_count,
					is_owner,
					avatar: null
				}

				return pageData;

			} else {
				throw new Error("Erro ao resgatar repositório de vídeo.");
			}
		} catch (err) {
			throw new Error(err);
		}

	}
}

export default WatchVideoService;
