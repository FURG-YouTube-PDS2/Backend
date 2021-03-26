import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Subscription from '../../models/Subscription';
import checkJwt from '../../middlewares/checkJwt';
import SubscribedService from '../getData/SubscribedService';

interface Request {
	user_id: string;
	token: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class DescriptionChannelService {
	public async execute({ user_id, token }: Request): Promise<object> {
		try {
			const userRepository = getRepository(User);
			const subscriptionRepository = getRepository(Subscription);
			var id_user;
			var is_owner;
			if (user_id !== '') {
				var user = await userRepository.findOne({ where: { id: user_id } });
				var id = checkJwt(token).sub;
				id_user = user_id;
				if (id === user_id) {
					is_owner = true;
				} else {
					is_owner = false;
				}
			} else {
				id_user = checkJwt(token).sub;
				var user = await userRepository.findOne({ where: { id: id_user } });

				is_owner = true;
			}

			if (user) {
				const subs = await subscriptionRepository.count({
					where: { user_target: id_user },
				});
				const subscription = new SubscribedService();
				if (is_owner === true) {
					var is_subs = false;
				} else {
					var is_subs = await subscription.execute({ token, target_id: id_user });
				}

				const data = {
					channel_nick: user?.username,
					channel_avatar: user?.avatar,
					all_subs: subs,
					is_subs,
					is_owner,
				};
				// console.log(data);
				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default DescriptionChannelService;
