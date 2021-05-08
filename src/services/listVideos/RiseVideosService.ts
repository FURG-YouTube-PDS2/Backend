import { Response as res } from 'express';
import { getRepository, getManager } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';

interface Request {
	numberSkip: number;
}

class RiseVideosService {
	public async execute({ numberSkip }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);

			if (videoRepository && userRepository && userVideoRepository) {
				// var id = '6925afb8-498f-40e7-a10d-7486c72ef408';
				var watsQuery = await getManager()
					.createQueryBuilder(Video, 'v')
					.select('v.id', 'id')
					.addSelect('v.title', 'title')
					.addSelect('v.description', 'description')
					.addSelect('v.privacy', 'privacy')
					.addSelect('v.created_at', 'date')
					.addSelect('uv.is_owner', 'owner')
					.addSelect('uv.user_id', 'channel_id')
					.addSelect((subQuery) => {
						return subQuery
							.select('SUM(uv.watches)', 'views')
							.from(UserVideo, 'uv')
							.where('uv.video_id = v.id');
					}, 'views')
					.addSelect((subQuery) => {
						return subQuery
							.select('u.username', 'channel')
							.from(User, 'u')
							.where('u.id = uv.user_id');
					}, 'channel')

					// .addSelect('SUM(uv.watches)', 'watches')
					.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
					.where(
						'v.privacy = false AND extract(day from NOW()-v.created_at) < 5 AND uv.is_owner = true',
					)

					// .addOrderBy('date', 'DESC')
					.addOrderBy('views', 'DESC')
					// .limit(100)
					.offset(numberSkip)

					.getRawMany();

				// console.log(watsQuery);
				var data = new Array();
				// var today = new Date();
				// for (let i = 0; i < watsQuery.length; i++) {
				// 	var currentMouth = today.getMonth();
				// 	var currentYear = today.getFullYear();
				// 	var currentDay = today.getDate();
				// 	var created_Year = watsQuery[i].date.getFullYear();
				// 	var created_Mouth = watsQuery[i].date.getMonth();
				// 	var created_Day = watsQuery[i].date.getDate();
				// 	if (currentYear === created_Year) {
				// 		if (currentMouth === created_Mouth) {
				// 			if (currentDay - created_Day <= 3) {
				// 				data.push({
				// 					id: watsQuery[i].v_id,
				// 					title: watsQuery[i].title,
				// 					description: watsQuery[i].description,
				// 					privacy: watsQuery[i].privacy,
				// 					channel: watsQuery[i].channel,
				// 					date: watsQuery[i].date,
				// 					is_owner: watsQuery[i].owner,
				// 					channel_id: watsQuery[i].channel_id,
				// 					views: watsQuery[i].views,
				// 				});
				// 			}
				// 		}
				// 	}
				// }

				return watsQuery;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default RiseVideosService;
