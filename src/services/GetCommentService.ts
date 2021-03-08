import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Comment from '../models/Comment';
import User from '../models/User';

import checkJwt from '../middlewares/checkJwt';

interface Request {
	video_id: string;
	numberSkip: string;
}

class GetCommentService {
	public async execute({ video_id, numberSkip }: Request): Promise<object> {
		try {
			const commentRepository = getRepository(Comment);
			const usersRepository = getRepository(User);

			// Aqui temos video_id, title, file e description
			var data = new Array();
			if (commentRepository) {
				var number = parseInt(numberSkip);
				const comment = await commentRepository.find({
					where: {
						video_id: video_id,
					},
					take: 20,
					skip: number,
					order: {
						created_at: 'DESC',
					},
				});
				for (let i = 0; i < comment.length; i++) {
					var user = await usersRepository.findOne({
						where: { id: comment[i].user_id },
					});
					data.push({
						id: comment[i].id,
						user_id: comment[i].user_id,
						nickname: user?.username,
						src: user?.avatar,
						comment: comment[i].text,
						date: comment[i].created_at,
						reply_id: comment[i].reply_id,
					});
					// console.log(user);
				}

				// const data = comment;

				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetCommentService;
