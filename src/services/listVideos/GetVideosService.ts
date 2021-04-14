import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import TagsVideo from '../../models/TagsVideo';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	numberSkip: number;
	token: string;
}

class GetVideosService {
	public async execute({ numberSkip, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const tagsVideoRepo = getRepository(TagsVideo);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);

			if (videoRepository && userRepository && userVideoRepository) {
				if (token !== '') {
					var user_id = checkJwt(token).sub;
				} else {
					var user_id = 'Random';
				}

				const hist_videos = await userVideoRepository.find({
					select: ['video_id'],
					take: 3,
					skip: numberSkip,
					where: {
						user_id,
					},
					order: {
						last_watch: 'DESC',
					},
				});

				var tags = new Array();
				for (let j = 0; j < hist_videos.length; j++) {
					var tag_videos = await tagsVideoRepo.find({
						where: { video_id: hist_videos[j].video_id },
					});
					for (let i = 0; i < tag_videos.length; i++) {
						tags.push(tag_videos[i].tag_id);
					}
				}

				var videos_id = new Array();
				// var id = new Array();

				for (let i = 0; i < tags.length; i++) {
					if (videos_id.length < 20 && i >= numberSkip) {
						var tag = await tagsVideoRepo.find({
							select: ['video_id'],
							where: { tag_id: tags[i].tag_id },
						});
						for (let x = 0; x < tag.length; x++) {
							var cond = true;
							for (let w = 0; w < videos_id.length; w++) {
								if (tag[x].video_id === videos_id[w]) {
									cond = false;
								}
							}
							if (cond) {
								videos_id.push(tag[x].video_id);
							}
						}
					}
				}

				if (videos_id.length < 20) {
					var remaining = 20 - videos_id.length;

					var videos = await videoRepository.find({
						select: ['id'],
						take: remaining,
						skip: numberSkip,
						where: {
							privacy: false,
						},
						order: {
							created_at: 'DESC',
						},
					});
					for (let i = 0; i < videos.length; i++) {
						var cond = true;
						for (let w = 0; w < videos_id.length; w++) {
							if (videos[i].id === videos_id[w]) {
								cond = false;
							}
						}
						if (cond) {
							videos_id.push(videos[i].id);
						}
					}
				}

				var newData = new Array();
				var Data = new Array();

				for (let w = 0; w < videos_id.length; w++) {
					Data.push(
						await videoRepository.findOne({
							select: ['id', 'title', 'thumb', 'created_at', 'privacy'],
							where: {
								id: videos_id[w],
								privacy: false,
							},
						}),
					);
				}

				for (let i = 0; i < Data.length; i++) {
					var userVideo = await userVideoRepository.findOne({
						where: { video_id: Data[i].id, is_owner: true },
					});
					var user = await userRepository.findOne({
						select: ['id', 'username', 'avatar'],
						where: { id: userVideo?.user_id },
					});
					var video_id = Data[i].id;
					var watchesQuery = await userVideoRepository
						.createQueryBuilder('user_videos')
						.select('SUM(user_videos.watches)', 'sum')
						.where('video_id = :video_id', { video_id })
						.getRawOne();
					var watches = watchesQuery.sum;
					// console.log(watches);

					newData.push({
						id: Data[i].id,
						title: Data[i].title,
						channel: user?.username,
						views: watches,
						date: Data[i].created_at,
						avatar: user?.avatar,
						channel_id: user?.id,
						thumb: Data[i].thumb,
					});
				}
				// console.log(newData);
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
