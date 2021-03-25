import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import User from '../../models/User';
import Comment from '../../models/Comment';
import UserComment from '../../models/UserComment';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	user_id: string;
	comment_id: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DataCommentService {
	public async execute({ user_id, comment_id }: Request): Promise<object> {
		try {
			const userRepository = getRepository(User);
			const UserCommentRepo = getRepository(UserComment);
			const CommentRepo = getRepository(Comment);

			// Aqui temos video_id, title, file e description
			if (UserCommentRepo && CommentRepo) {
				// Count Likes
				const likes = await UserCommentRepo.createQueryBuilder('user_comments')
					.select('user_comments.liked')
					.where('user_comments.liked = 1 and comment_id = :comment_id', { comment_id })
					.getCount();

				var liked = await UserCommentRepo.createQueryBuilder('user_comments')
					.select('user_comments.liked')
					.where('user_id = :user_id and comment_id = :comment_id', {
						user_id,
						comment_id,
					})
					.getCount();
				const data = {
					likes: likes,
					liked: liked,
				};
				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DataCommentService;
