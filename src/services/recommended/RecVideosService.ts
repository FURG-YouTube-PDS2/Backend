import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Video from '../../models/Video';
import TagsVideo from '../../models/TagsVideo';

interface Request {
	video_id: string;
}

class RecVideosService {
	public async execute({ video_id }: Request): Promise<object> {
		const tagsVideoRepo = getRepository(TagsVideo);
		const videoRepo = getRepository(Video);
		const userRepository = getRepository(User);
		const userVideoRepository = getRepository(UserVideo);

		// console.log(video_id);

		var exists_video = await videoRepo.findOne({
			id: video_id,
		});
		if (exists_video) {
			var tags = await tagsVideoRepo.find({
				select: ['tag_id'],
				where: { video_id: video_id },
			});

			var videos = new Array();
			var id = new Array();

			for (let i = 0; i < tags.length; i++) {
				if (videos.length <= 20) {
					var tag = await tagsVideoRepo.find({
						select: ['video_id'],
						where: { tag_id: tags[i].tag_id },
					});
					for (let x = 0; x < tag.length; x++) {
						var cond = true;
						for (let w = 0; w < videos.length; w++) {
							if (tag[x].video_id === videos[w]) {
								cond = false;
							}
						}
						if (cond) {
							videos.push(tag[x].video_id);
						}
					}
				}
			}

			var videosData = new Array();
			for (let idx = 0; idx < videos.length; idx++) {
				videosData.push(
					await videoRepo.findOne({
						select: ['id', 'title', 'created_at', 'privacy'],
						where: {
							privacy: false,
							id: videos[idx],
						},
					}),
				);
			}

			var newData = new Array();
			// console.log(videos.length);

			for (let i = 0; i < videosData.length; i++) {
				var userVideo = await userVideoRepository.findOne({
					where: { video_id: videosData[i].id, is_owner: true },
				});
				var user = await userRepository.findOne({
					select: ['id', 'username'],
					where: { id: userVideo?.user_id },
				});
				var videoId = videosData[i].id;
				var watchesQuery = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('SUM(user_videos.watches)', 'sum')
					.where('video_id = :videoId', { videoId })
					.getRawOne();
				var watches = watchesQuery.sum;
				// console.log(watches);

				newData.push({
					status: 1,
					id: videosData[i].id,
					title: videosData[i].title,
					channel: user?.username,
					views: watches,
					date: videosData[i].created_at,
					channel_id: user?.id,
				});
			}

			return newData;
		} else {
			return [{ status: 0 }];
		}
	}
}

export default RecVideosService;
