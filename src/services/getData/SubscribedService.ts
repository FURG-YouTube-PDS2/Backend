import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	target_id: string;
}

class SubscribedService {
	public async execute({ token, target_id }: Request): Promise<boolean> {
		try {
			const subscriptionRepository = getRepository(subscription);
			const user_id = checkJwt(token).sub;

			const created_at = new Date();
			const verifySubscribed = await subscriptionRepository.findOne({
				where: { user_subscriber: user_id, user_target: target_id },
			});
			const is_subscribed = verifySubscribed ? true : false;

			// Aqui temos video_id, title, file e description
			if (subscriptionRepository) {
				var Data;
				if (is_subscribed) {
					return true;
				} else {
					return false;
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default SubscribedService;
