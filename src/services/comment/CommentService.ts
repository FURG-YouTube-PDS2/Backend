import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Comment from '../../models/Comment';
import CreateNotificationService from '../notification/CreateNotificationService';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	text: string;
	video_id: string;
	reply_id: string;
}

class CommentCreateService {
	public async execute({ token, text, video_id, reply_id }: Request): Promise<object> {
		try {
			const commentRepository = getRepository(Comment);
			const userRepository = getRepository(User);
			const user_id = checkJwt(token).sub;

			const created_at = new Date();
			const edited = false;
			// Aqui temos video_id, title, file e description
			if (commentRepository) {
				const comment = await commentRepository.save({
					text,
					created_at,
					edited,
					video_id,
					reply_id,
					user_id,
				});

				const id = await commentRepository.findOne({
					select: ['id'],
					where: { video_id, user_id, reply_id, created_at, text },
				});
				const user = await userRepository.findOne({
					select: ['avatar', 'username'],
					where: { id: user_id },
				});

				if (reply_id !== '') {
					const notification = new CreateNotificationService();
					const status = await notification.execute({
						type: 'comment',
						action_id: video_id,
						target_id: reply_id,
					});
				}

				const Data = {
					id,
					username: user?.username,
					src: user?.avatar,
					text,
					created_at,
					edited,
					video_id,
					reply_id,
					user_id: token,
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

export default CommentCreateService;
