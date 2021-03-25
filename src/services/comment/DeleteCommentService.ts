import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import User from '../../models/User';
import Comment from '../../models/Comment';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	comment_id: string;
}

class DeleteCommentService {
	public async execute({ comment_id }: Request): Promise<object> {
		try {
			const commentRepository = getRepository(Comment);
			const userRepository = getRepository(User);

			const created_at = new Date();
			const edited = true;
			// Aqui temos video_id, title, file e description
			if (commentRepository) {
				await commentRepository.delete({
					reply_id: comment_id,
				});
				await commentRepository.delete({
					id: comment_id,
				});
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DeleteCommentService;
