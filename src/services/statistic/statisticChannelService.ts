import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Subscription from '../../models/Subscription';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
}

class statisticChannelService {
	public async execute({ token }: Request): Promise<object> {
		try {
			const subsRepo = getRepository(Subscription);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);

			const user_id = checkJwt(token).sub;

			if (userRepository && userVideoRepository) {
				const ids = await userVideoRepository.find({
					select: ['video_id'],
					where: {
						user_id,
						is_owner: true,
					},
				});
				var videos_id = new Array();
				for (let i = 0; i < ids.length; i++) {
					videos_id.push(ids[i].video_id);
				}
				const subs = await subsRepo.find({
					select: ['user_subscriber'],
					where: { user_target: user_id },
				});

				var subs_id = new Array();
				for (let i = 0; i < subs.length; i++) {
					subs_id.push(subs[i].user_subscriber);
				}
				if (videos_id.length !== 0) {
					const u_id = await userVideoRepository
						.createQueryBuilder('user_videos')
						.select('user_id')
						.where('user_id != (:user_id) AND video_id IN (:...videos_id)', {
							user_id,
							videos_id,
						})
						.getRawMany();
					var users_id = new Array();
					for (let i = 0; i < u_id.length; i++) {
						if (!users_id.includes(u_id[i].user_id)) {
							users_id.push(u_id[i].user_id);
						}
					}
					var female = await userRepository
						.createQueryBuilder('user')
						.select('gender')
						.where('gender = (:g) AND id IN (:...users_id)', { g: 'w', users_id })
						.getCount();
					var male = await userRepository
						.createQueryBuilder('user')
						.select('gender')
						.where('gender = (:g) AND id IN (:...users_id)', { g: 'm', users_id })
						.getCount();
					var others = await userRepository
						.createQueryBuilder('user')
						.select('gender')
						.where('gender = (:g) AND id IN (:...users_id)', { g: 'a', users_id })
						.getCount();
					var ten = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) < 3650 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();

					var thirteen = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) >= 3650 AND extract(day from NOW()-birthdate) < 5110 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();
					var sixteen = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) >= 5110 AND extract(day from NOW()-birthdate) < 6205 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();
					var nineteen = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) >= 6205 AND extract(day from NOW()-birthdate) < 7300 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();
					var tw_four = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) >= 7300 AND extract(day from NOW()-birthdate) < 8760 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();
					var tw_five = await userRepository
						.createQueryBuilder('user')
						.select('birthdate')
						.where(
							'extract(day from NOW()-birthdate) >= 8760 AND id IN (:...users_id)',
							{
								users_id,
							},
						)
						.getCount();
				} else {
					var female = 0;
					var male = 0;
					var others = 0;
					var ten = 0;
					var thirteen = 0;
					var sixteen = 0;
					var nineteen = 0;
					var tw_four = 0;
					var tw_five = 0;
				}
				if (subs_id.length !== 0) {
					const channels = await subsRepo
						.createQueryBuilder('subscriptions')
						.select('user_target')
						.addSelect('COUNT(*)')
						.where('user_target != (:user_id) AND user_subscriber IN (:...subs_id)', {
							user_id,
							subs_id,
						})
						.groupBy('user_target')
						.orderBy('COUNT(*)', 'DESC')
						.limit(10)
						.getRawMany();

					var users = new Array();
					for (let i = 0; i < channels.length; i++) {
						users.push(channels[i].user_target);
					}

					var infos_user = await userRepository
						.createQueryBuilder('user')
						.select('username')
						.addSelect('id')
						.where('id IN (:...users)', { users })
						.getRawMany();

					var countUser = new Array(infos_user.length);
					for (let i = 0; i < users.length; i++) {
						for (let j = 0; j < infos_user.length; j++) {
							if (channels[i].user_target === infos_user[j].id) {
								countUser[j] = channels[i].count;
							}
						}
					}
				} else {
					var infos_user = new Array();
					var countUser = new Array();
				}
				var data = {
					gender: [female, male, others],
					age: [ten, thirteen, sixteen, nineteen, tw_four, tw_five],
					channels: {
						name: infos_user,
						data: countUser,
					},
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

export default statisticChannelService;
