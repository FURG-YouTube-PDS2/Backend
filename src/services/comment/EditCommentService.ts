import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import User from '../../models/User';
import Comment from '../../models/Comment';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	text: string;
	comment_id: string;
}

class EditCommentService {
	public async execute({ text, comment_id }: Request): Promise<object> {
		try {
			const commentRepository = getRepository(Comment);
			const userRepository = getRepository(User);

			const created_at = new Date();
			const edited = true;
			// Aqui temos video_id, title, file e description
			if (commentRepository) {
				const comment = await commentRepository.save({
					text,
					created_at,
					edited,
				});

				const Data = {
					text,
					edited,
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

export default EditCommentService;
