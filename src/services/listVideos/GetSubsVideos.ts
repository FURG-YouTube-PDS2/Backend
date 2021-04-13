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

class GetSubsVideos {
	public async execute({ token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const subsRepo = getRepository(Subscription);
			const user_id = checkJwt(token).sub;

			if (videoRepository && userRepository && userVideoRepository) {
				var subs = await subsRepo.find({
					select: ['user_target'],
					where: { user_subscriber: user_id },
				});
				var videos = new Array();
				for (let i = 0; i < subs.length; i++) {
					var video_ids = await userVideoRepository.find({
						select: ['video_id'],
						where: { user_id: subs[i].user_target, is_owner: true },
					});
					var all_videos = await videoRepository.find({
						select: ['id', 'title', 'thumb', 'created_at', 'privacy'],
						where: {
							id: video_ids[i].video_id,
							privacy: false,
						},
					});
					for (let j = 0; j < all_videos.length; j++) {
						videos.push(all_videos[j]);
					}
				}

				var newData = new Array();

				for (let i = 0; i < videos.length; i++) {
					var userVideo = await userVideoRepository.findOne({
						where: { video_id: videos[i].id, is_owner: true },
					});
					var user = await userRepository.findOne({
						select: ['id', 'username', 'avatar'],
						where: { id: userVideo?.user_id },
					});
					var video_id = videos[i].id;
					var watchesQuery = await userVideoRepository
						.createQueryBuilder('user_videos')
						.select('SUM(user_videos.watches)', 'sum')
						.where('video_id = :video_id', { video_id })
						.getRawOne();
					var watches = watchesQuery.sum;
					// console.log(watches);

					newData.push({
						id: videos[i].id,
						title: videos[i].title,
						channel: user?.username,
						views: watches,
						date: videos[i].created_at,
						avatar: user?.avatar,
						channel_id: user?.id,
						thumb: videos[i].thumb,
					});
				}
				console.log(newData);
				return { newData: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetSubsVideos;
