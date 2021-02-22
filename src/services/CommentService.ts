import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import User from '../models/User';
import Comment from '../models/Comment';

import checkJwt from '../middlewares/checkJwt';

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
			const user_id = checkJwt(token).sub;

			const created_at = new Date();
			const edited = false;
			// Aqui temos video_id, title, file e description
			if (commentRepository) {
				const subs = await commentRepository.save({
					text,
					created_at,
					edited,
					video_id,
					reply_id,
					user_id,
				});

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

export default CommentCreateService;
