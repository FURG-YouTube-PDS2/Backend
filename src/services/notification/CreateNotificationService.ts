import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Notification from '../../models/Notification';
import Subscription from '../../models/Subscription';
import User from '../../models/User';
import UserVideo from '../../models/UserVideo';
import Comment from '../../models/Comment';

interface Request {
	type: string;
	action_id: string;
	target_id: string;
}

class CreateNotificationService {
	public async execute({ type, action_id, target_id }: Request): Promise<object> {
		try {
			const notificationRepo = getRepository(Notification);
			const subsRepo = getRepository(Subscription);
			const userRepo = getRepository(User);
			const userVideoRepo = getRepository(UserVideo);
			const commentRepo = getRepository(Comment);
			const created_at = new Date();
			if (notificationRepo && subsRepo && userRepo && commentRepo && userVideoRepo) {
				if (type === 'new_video') {
					const all_subs = await subsRepo.find({
						select: ['user_subscriber'],
						where: { user_target: target_id },
					});
					for (let i = 0; i < all_subs.length; i++) {
						await notificationRepo.save({
							type,
							readed: false,
							user_id: all_subs[i].user_subscriber,
							action_id, // video_id
							target_id, // user_id owner
							created_at,
						});
					}
				} else if (type === 'like_comment') {
					const user = await commentRepo.findOne({
						select: ['user_id'],
						where: { id: target_id },
					});
					await notificationRepo.save({
						type,
						readed: false,
						user_id: user?.user_id,
						action_id, // video_id
						target_id, // comment_id
						created_at,
					});
				} else if (type === 'comment') {
					const user = await commentRepo.findOne({
						select: ['user_id'],
						where: { id: target_id },
					});
					await notificationRepo.save({
						type,
						readed: false,
						user_id: user?.user_id,
						action_id, // video_id
						target_id, // coment_ id
						created_at,
					});
				}

				//else if (type === 'new_comment') {
				// 	const user = await userVideoRepo.findOne({
				// 		select: ['user_id'],
				// 		where: { video_id: action_id, is_owner: true },
				// 	});
				// 	await notificationRepo.save({
				// 		type,
				// 		readed: false,
				// 		user_id: user?.user_id,
				// 		action_id, // video_id
				// 		target_id, // comment_id
				// 		created_at,
				// 	});
				// } else if (type === 'new_liked') {
				// 	const user = await userVideoRepo.findOne({
				// 		select: ['user_id'],
				// 		where: { video_id: action_id, is_owner: true },
				// 	});
				// 	await notificationRepo.save({
				// 		type,
				// 		readed: false,
				// 		user_id: user?.user_id,
				// 		action_id, // video_id
				// 		target_id, // user_id
				// 		created_at,
				// 	});
				// }
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default CreateNotificationService;
