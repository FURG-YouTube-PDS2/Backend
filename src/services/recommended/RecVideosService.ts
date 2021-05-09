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
				id.push(tags[i].tag_id);
			}
			var tag = await tagsVideoRepo
				.createQueryBuilder('tags_video')
				.select('video_id')
				.where('video_id != (:video_id) AND tag_id IN (:...id)', { video_id, id })
				.getRawMany();

			for (let x = 0; x < tag.length; x++) {
				if (x < 20) {
					if (!videos.includes(tag[x].video_id)) {
						videos.push(tag[x].video_id);
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
					.where('video_id = (:videoId)', { videoId })
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
