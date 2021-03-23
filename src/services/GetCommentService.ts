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
						reply_id: '',
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
				}
				// var vec_comments = new Array();
				for (let j = 0; j < comment.length; j++) {
					var sec_comment = await commentRepository.find({
						where: {
							video_id: video_id,
							reply_id: comment[j].user_id,
						},
						take: 20,
						skip: number,
						order: {
							created_at: 'DESC',
						},
					});
					for (let w = 0; w < sec_comment.length; w++) {
						var user = await usersRepository.findOne({
							where: { id: sec_comment[w].user_id },
						});
						data.push({
							id: sec_comment[w].id,
							user_id: sec_comment[w].user_id,
							nickname: user?.username,
							src: user?.avatar,
							comment: sec_comment[w].text,
							date: sec_comment[w].created_at,
							reply_id: sec_comment[w].reply_id,
						});
					}
				}

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
