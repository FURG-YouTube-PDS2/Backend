import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import User from '../../models/User';
import Subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';
import ActionVideoService from './ActionVideoService';
import SubscribedService from '../getData/SubscribedService';
import DescriptionVideoService from './DescriptionVideoService';

interface Request {
	video_id: string;
	token: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class WatchVideoService {
	public async execute({ video_id, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);

			const actionVideo = new ActionVideoService();
			const descVideo = new DescriptionVideoService();
			const subscribed = new SubscribedService();
			const varVideo = await actionVideo.execute({ video_id, token });
			const infoVideo = await descVideo.execute({ video_id });
			var target_id = infoVideo.owner_id;

			if (token !== '') {
				var is_subscribed = await subscribed.execute({ token, target_id });
				const user_id = checkJwt(token).sub;
			} else {
				var is_subscribed = false;
				const user_id = 'Ramdon';
			}

			if (user_id === infoVideo.owner_id) {
				var owner = true;
			} else {
				var owner = false;
			}
			// // AINDA FALTA AVATAR
			const pageData = {
				owner,
				owner_id: infoVideo.owner_id,
				owner_nick: infoVideo.owner_nick,
				owner_avatar: infoVideo.owner_avatar,
				all_subs: infoVideo.all_subs,
				title: infoVideo.title,
				description: infoVideo.description,
				views: varVideo.watches,
				likes: varVideo.likes,
				dislikes: varVideo.dislikes,
				liked: varVideo.liked,
				reported: varVideo.reported,
				is_subscribed,
			};
			// console.log(pageData);
			// const pageData = {
			// 	status: 1,
			// };
			return pageData;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default WatchVideoService;
