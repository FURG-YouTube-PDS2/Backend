import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';
import checkJwt from '../../middlewares/checkJwt';

interface Request {
	user_id: string;
	token: string;
}

class GetVideoService {
	public async execute({ user_id, token }: Request): Promise<object> {
		try {
			const userVideoRepo = getRepository(UserVideo);
			const videoRepo = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);
			if (user_id !== '') {
				var target_id = user_id;
			} else {
				var target_id = checkJwt(token).sub;
			}

			// console.log(user_id);
			var data = await userVideoRepo.find({
				select: ['video_id'],
				where: { user_id: target_id, is_owner: true },
				order: { created_at: 'DESC' },
			});

			var newData = Array();

			for (let i = 0; i < data.length; i++) {
				var videoData = await videoRepo.findOne({
					select: ['id', 'title', 'thumb', 'created_at'],
					where: { id: data[i].video_id, privacy: false },
				});
				var video_id = videoData?.id;
				var watchesQuery = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('SUM(user_videos.watches)', 'sum')
					.where('video_id = :video_id', { video_id })
					.getRawOne();
				var watches = watchesQuery.sum;
				newData.push({
					video_id: videoData?.id,
					title: videoData?.title,
					thumb: videoData?.thumb,
					views: watches,
					created_at: videoData?.created_at,
				});
			}
			var resolvedNewData = newData;
			// console.log(resolvedData);
			return resolvedNewData;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetVideoService;
