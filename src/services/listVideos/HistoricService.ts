import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	numberSkip: string;
	token: string;
}

class HistoricService {
	public async execute({ numberSkip, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const user_id = checkJwt(token).sub;

			if (videoRepository && userRepository && userVideoRepository) {
				var number = parseInt(numberSkip);
				const hist_videos = await userVideoRepository.find({
					select: ['video_id'],
					take: 20,
					skip: number,
					where: {
						user_id,
					},
					order: {
						last_watch: 'DESC',
					},
				});
				var newData = new Array();
				// console.log(videos.length);

				for (let i = 0; i < hist_videos.length; i++) {
					var videos = await videoRepository.find({
						select: ['id', 'title', 'thumb', 'created_at', 'privacy'],
						take: 20,
						skip: number,
						where: {
							id: hist_videos[i].id,
						},
					});
					var userVideo = await userVideoRepository.findOne({
						where: { video_id: hist_videos[i].id, is_owner: true },
					});
					var user = await userRepository.findOne({
						select: ['id', 'username', 'avatar'],
						where: { id: userVideo?.user_id },
					});
					var video_id = hist_videos[i].id;
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

export default HistoricService;
