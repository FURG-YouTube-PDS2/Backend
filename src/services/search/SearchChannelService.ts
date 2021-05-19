import { getRepository, getManager } from 'typeorm';

import Video from '../../models/Video';
import User from '../../models/User';
import UserVideo from '../../models/UserVideo';

import checkJwt from '../../middlewares/checkJwt';
interface Request {
	input: string;
	channel_id: string;
	token: string;
}

class SearchChannelService {
	public async execute({ input, channel_id, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);

			if (videoRepository) {
				if (channel_id === null || channel_id === '' || channel_id === '0') {
					channel_id = checkJwt(token).sub;
				}

				var videos_id = new Array();
				var videos = await getManager()
					.createQueryBuilder(Video, 'v')
					.select('v.id', 'id')
					.addSelect('v.title', 'title')
					.addSelect('v.description', 'description')
					.addSelect('v.privacy', 'privacy')
					.addSelect('v.created_at', 'created_at')
					.addSelect('uv.is_owner', 'owner')
					.addSelect('uv.user_id', 'channel_id')
					.addSelect((subQuery) => {
						return subQuery
							.select('SUM(uv.watches)', 'views')
							.from(UserVideo, 'uv')
							.where('uv.video_id = v.id');
					}, 'views')
					.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
					.where(
						'v.privacy = false AND v.title ~* (:searchTerm) AND uv.user_id = (:channel_id) AND uv.is_owner = true',
						{
							searchTerm: input,
							channel_id,
						},
					)
					.getRawMany();

				// console.log(videos);
				var data = {
					videos,
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

export default SearchChannelService;
