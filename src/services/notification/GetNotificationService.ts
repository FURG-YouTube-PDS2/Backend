import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Notification from '../../models/Notification';
import Subscription from '../../models/Subscription';
import User from '../../models/User';
import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';
import Comment from '../../models/Comment';
import Nintube from '../../models/Nintube';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
}

class GetNotificationService {
	public async execute({ token }: Request): Promise<object> {
		try {
			const notificationRepo = getRepository(Notification);
			const subsRepo = getRepository(Subscription);
			const userRepo = getRepository(User);
			const userVideoRepo = getRepository(UserVideo);
			const VideoRepo = getRepository(Video);
			const commentRepo = getRepository(Comment);
			const ninRepository = getRepository(Nintube);

			const user_id = checkJwt(token).sub;

			if (notificationRepo && userRepo && commentRepo && userVideoRepo && VideoRepo) {
				const all_nots = await notificationRepo.find({
					where: { user_id: user_id },
					take: 20,
					order: { created_at: 'DESC' },
				});
				var data = new Array();
				for (let i = 0; i < all_nots.length; i++) {
					if (all_nots[i].type === 'new_video') {
						var video = await VideoRepo.findOne({
							select: ['thumb', 'title'],
							where: { id: all_nots[i].action_id },
						});
						var user = await userRepo.findOne({
							select: ['avatar', 'username'],
							where: { id: all_nots[i].target_id },
						});
						data.push({
							id: all_nots[i].id,
							avatar: user?.avatar,
							name: user?.username,
							type: all_nots[i].type,
							text: video?.title,
							thumb: video?.thumb,
							date: all_nots[i].created_at,
							readed: all_nots[i].readed,
							video_id: all_nots[i].action_id,
						});
					} else if (all_nots[i].type === 'like_comment') {
						var nin = await ninRepository.findOne({
							where: { nickname: 'default' },
						});
						var video = await VideoRepo.findOne({
							select: ['thumb', 'title'],
							where: { id: all_nots[i].action_id },
						});
						var comment = await commentRepo.findOne({
							select: ['text', 'user_id'],
							where: { id: all_nots[i].target_id },
						});
						data.push({
							id: all_nots[i].id,
							avatar: nin?.file,
							name: 'Alguém',
							type: all_nots[i].type,
							text: comment?.text,
							thumb: video?.thumb,
							date: all_nots[i].created_at,
							readed: all_nots[i].readed,
							video_id: all_nots[i].action_id,
						});
					} else if (all_nots[i].type === 'comment') {
						var nin = await ninRepository.findOne({
							where: { nickname: 'default' },
						});
						var video = await VideoRepo.findOne({
							select: ['thumb', 'title'],
							where: { id: all_nots[i].action_id },
						});
						var comment = await commentRepo.findOne({
							select: ['text', 'user_id'],
							where: { id: all_nots[i].target_id },
						});
						data.push({
							id: all_nots[i].id,
							avatar: nin?.file,
							name: 'Alguém',
							type: all_nots[i].type,
							text: comment?.text,
							thumb: video?.thumb,
							date: all_nots[i].created_at,
							readed: all_nots[i].readed,
							video_id: all_nots[i].action_id,
						});
					}
					// else if (all_nots[i].type === 'new_comment') {
					// 	// const data = await ninRepository.findOne({
					// 	// 	where: { nickname: 'default' },
					// 	// });
					// 	var video = await VideoRepo.findOne({
					// 		select: ['thumb'],
					// 		where: { id: all_nots[i].action_id },
					// 	});
					// 	var comment = await commentRepo.findOne({
					// 		select: ['text', 'user_id'],
					// 		where: { id: all_nots[i].target_id },
					// 	});
					// 	var user = await userRepo.findOne({
					// 		select: ['avatar', 'username'],
					// 		where: { id: comment?.user_id },
					// 	});
					// 	data.push({
					// 		avatar: user?.avatar,
					// 		name: user?.username,
					// 		// text: comment?.text,
					// 		type: all_nots[i].type,
					// 		text: video?.title,
					// 		thumb: video?.thumb,
					// 		date: all_nots[i].created_at,
					// 		readed: all_nots[i].readed,
					// 	});
					// }
					// else if (all_nots[i].type === 'new_liked') {
					// 	var video = await VideoRepo.findOne({
					// 		select: ['thumb', 'title'],
					// 		where: { id: all_nots[i].action_id },
					// 	});

					// 	var user = await userRepo.findOne({
					// 		select: ['avatar', 'username'],
					// 		where: { id: all_nots[i].target_id },
					// 	});
					// 	data.push({
					// 		avatar: user?.avatar,
					// 		name: user?.username,
					// 		text: video?.title,
					// 		type: all_nots[i].type,
					// 		thumb: video?.thumb,
					// 		date: all_nots[i].created_at,
					// 		readed: all_nots[i].readed,
					// 	});
					// }
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

export default GetNotificationService;
