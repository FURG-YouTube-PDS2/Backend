import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserComment from '../../models/UserComment';
import Comment from '../../models/Comment';
import Notification from '../../models/Notification';
import CreateNotificationService from '../notification/CreateNotificationService';
import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	comment_id: string;
	liked: number;
}

class LikedCommentService {
	public async execute({ token, comment_id, liked }: Request): Promise<object> {
		try {
			const userCommentRepo = getRepository(UserComment);
			const CommentRepo = getRepository(Comment);
			const user_id = checkJwt(token).sub;
			const notificationRepo = getRepository(Notification);

			const comment = await userCommentRepo.findOne({
				where: { user_id: user_id, comment_id: comment_id },
			});

			const created_at = new Date();
			const is_liked = comment ? true : false;
			// Aqui temos video_id, title, file e description
			if (userCommentRepo) {
				if (!is_liked) {
					const comm = await userCommentRepo.save({
						user_id,
						liked,
						comment_id,
						created_at,
					});
					const commId = await CommentRepo.findOne({
						where: { id: comment_id },
					});
					const nots = await notificationRepo.findOne({
						where: { user_id: commId?.user_id, target_id: comment_id },
					});

					if (!nots) {
						const notification = new CreateNotificationService();
						const status = await notification.execute({
							type: 'like_comment',
							action_id: commId!.video_id,
							target_id: comment_id,
						});
					}
				} else {
					await userCommentRepo.delete({
						id: comment?.id,
					});
				}

				// AINDA FALTA AVATAR
				const Data = {
					status: 1,
				};

				return Data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default LikedCommentService;
