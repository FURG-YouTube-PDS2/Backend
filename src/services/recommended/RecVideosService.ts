import { getRepository, getManager } from 'typeorm';

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

			if (id.length !== 0) {
				var tag = await tagsVideoRepo
					.createQueryBuilder('tags_video')
					.select('video_id')
					.where('video_id != (:video_id) AND tag_id IN (:...id)', { video_id, id })
					.limit(20)
					.getRawMany();
				var user_ = await userVideoRepository.findOne({
					select: ['user_id'],
					where: { video_id, is_owner: true },
				});

				var user_video = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('video_id')
					.where(
						'video_id != (:video_id) AND user_id = (:owner_id) AND is_owner = true',
						{
							video_id,
							owner_id: user_?.user_id,
						},
					)
					.limit(20 - tag.length)
					.getRawMany();

				for (let x = 0; x < tag.length; x++) {
					if (!videos.includes(tag[x].video_id)) {
						videos.push(tag[x].video_id);
					}
				}
				for (let x = 0; x < user_video.length; x++) {
					if (!videos.includes(user_video[x].video_id)) {
						videos.push(user_video[x].video_id);
					}
				}
			} else {
				var user_ = await userVideoRepository.findOne({
					select: ['user_id'],
					where: { video_id, is_owner: true },
				});

				var user_video = await userVideoRepository
					.createQueryBuilder('user_videos')
					.select('video_id')
					.where(
						'video_id != (:video_id) AND user_id = (:owner_id) AND is_owner = true',
						{
							video_id,
							owner_id: user_?.user_id,
						},
					)
					.limit(20)
					.getRawMany();
				for (let x = 0; x < user_video.length; x++) {
					if (!videos.includes(user_video[x].video_id)) {
						videos.push(user_video[x].video_id);
					}
				}
			}

			var watsQuery = await getManager()
				.createQueryBuilder(Video, 'v')
				.select('v.id', 'id')
				.addSelect('v.title', 'title')
				.addSelect('v.privacy', 'privacy')
				.addSelect('v.created_at', 'date')
				.addSelect('uv.is_owner', 'owner')
				.addSelect('uv.user_id', 'channel_id')
				.addSelect((subQuery) => {
					return subQuery
						.select('SUM(uv.watches)', 'views')
						.from(UserVideo, 'uv')
						.where('uv.video_id = v.id');
				}, 'views')
				.addSelect((subQuery) => {
					return subQuery
						.select('u.username', 'channel')
						.from(User, 'u')
						.where('u.id = uv.user_id');
				}, 'channel')
				.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
				.where('v.privacy = false AND v.id IN (:...videos) AND uv.is_owner = true', {
					videos,
				})
				.addOrderBy('views', 'DESC')
				.getRawMany();
			return watsQuery;
		} else {
			return [{ status: 0 }];
		}
	}
}

export default RecVideosService;
