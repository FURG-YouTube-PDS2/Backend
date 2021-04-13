import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';
import Comment from '../../models/Comment';
import UserComment from '../../models/UserComment';
import TagsVideo from '../../models/TagsVideo';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	video_id: string;
}

class DeleteVideoService {
	public async execute({ video_id }: Request): Promise<object> {
		try {
			const UserVideoRepo = getRepository(UserVideo);
			const VideoRepo = getRepository(Video);
			const commentRepo = getRepository(Comment);
			const userCommentRepo = getRepository(UserComment);
			const tagsVideoRepo = getRepository(TagsVideo);
			if (VideoRepo) {
				await VideoRepo.delete({
					id: video_id,
				});

				var user_videos = await UserVideoRepo.find({
					where: { video_id },
				});
				for (let i = 0; i < user_videos.length; i++) {
					await UserVideoRepo.delete({
						id: user_videos[i].id,
					});
				}

				var comments = await commentRepo.find({
					where: { video_id },
				});
				for (let i = 0; i < comments.length; i++) {
					await commentRepo.delete({
						id: comments[i].id,
					});
					var user_comments = await userCommentRepo.find({
						where: { video_id },
					});
					for (let i = 0; i < user_comments.length; i++) {
						await userCommentRepo.delete({
							id: user_comments[i].id,
						});
					}
				}

				var tags = await tagsVideoRepo.find({
					where: { video_id },
				});
				for (let i = 0; i < tags.length; i++) {
					await tagsVideoRepo.delete({
						id: tags[i].id,
					});
				}

				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DeleteVideoService;
