import { Response as res } from 'express';
import { getRepository, getManager } from 'typeorm';

import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import User from '../models/User';

interface Request {}

class RiseVideosService {
	public async execute({}: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);

			if (videoRepository && userRepository && userVideoRepository) {
				// var id = '6925afb8-498f-40e7-a10d-7486c72ef408';
				var watsQuery = await getManager()
					.createQueryBuilder(Video, 'v')
					.addSelect('v.id', 'v_id')
					.addSelect('v.title', 'title')
					.addSelect('v.description', 'description')
					.addSelect('v.privacy', 'privacy')
					.addSelect('v.thumb', 'thumb')
					.addSelect('v.created_at', 'date')
					.addSelect('uv.is_owner', 'owner')
					.addSelect('uv.user_id', 'user_id')
					.addSelect((subQuery) => {
						return subQuery
							.select('SUM(uv.watches)', 'watches')
							.from(UserVideo, 'uv')
							.where('uv.video_id = v.id');
					}, 'watches')
					// .addSelect('SUM(uv.watches)', 'watches')
					.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
					.where('uv.is_owner = true')

					.addOrderBy('date', 'DESC')
					.addOrderBy('watches', 'DESC')
					.limit(20)
					.offset()

					.getRawMany();
				// var wats = watsQuery;
				console.log(watsQuery);
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
