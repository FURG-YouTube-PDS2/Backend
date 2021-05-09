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

				var users_id = new Array();
				for (let i = 0; i < subs.length; i++) {
					users_id.push(subs[i].user_target);
				}

				const channels = await userRepository
					.createQueryBuilder('user')
					.select('username')
					.addSelect('id')
					.where('id IN (:...users_id)', {
						users_id,
					})
					.getRawMany();

				for (let i = 0; i < subs.length; i++) {
					var video_ids = await userVideoRepository.find({
						select: ['video_id'],
						where: { user_id: subs[i].user_target, is_owner: true },
					});

					for (let j = 0; j < video_ids.length; j++) {
						videos.push(
							await videoRepository.findOne({
								select: ['id', 'title', 'created_at', 'privacy'],
								where: {
									id: video_ids[j].video_id,
									privacy: false,
								},
								order: { created_at: 'DESC' },
							}),
						);
					}
				}

				var newData = new Array();

				for (let i = 0; i < videos.length; i++) {
					var userVideo = await userVideoRepository.findOne({
						where: { video_id: videos[i].id, is_owner: true },
					});
					var user = await userRepository.findOne({
						select: ['id', 'username'],
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
						channel_id: user?.id,
					});
				}

				return { channels, videos: newData };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetSubsVideos;
