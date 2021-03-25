import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';

interface Request {
	numberSkip: string;
}

class GetVideosService {
	public async execute({ numberSkip }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);

			if (videoRepository && userRepository && userVideoRepository) {
				var number = parseInt(numberSkip);
				const videos = await videoRepository.find({
					select: ['id', 'title', 'thumb', 'created_at', 'privacy'],
					take: 20,
					skip: number,
					where: {
						privacy: false,
					},
					order: {
						created_at: 'DESC',
					},
				});
				var newData = new Array();
				// console.log(videos.length);

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

				return newData;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetVideosService;
