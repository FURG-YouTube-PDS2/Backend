import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserComment from '../../models/UserComment';

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
			const user_id = checkJwt(token).sub;

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
