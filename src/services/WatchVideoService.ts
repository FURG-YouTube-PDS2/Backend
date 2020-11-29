import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import User from '../models/User';

import checkJwt from '../middlewares/checkJwt'

interface Request {
	video_id: string;
	token: string;
}


class WatchVideoService {
	public async execute({ video_id, token }: Request): Promise<object> {
		try {

			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);


			const user_id = checkJwt(token).sub;

			const video = await videoRepository.findOne(video_id)
			const user = await userRepository.findOne(user_id)


			// Temos video_id, title, file e description
			if (video && user) {
				const videoUser = await userVideoRepository.findOne({ where: { video_id, user_id } })


				if (videoUser) {
					const { is_owner, liked } = videoUser;
				} else {
					const is_owner = false, liked = 0, watches = 1;
					const reported = false, report_text = "", report_option = "";

					await userVideoRepository.save({
						video_id,
						user_id,
						is_owner,
						liked,
						watches,
						reported,
						report_text,
						report_option,
					})
				}

				// Get watches, query return [ { sum: valor } ]
				const watchesQuery = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("SUM(user_videos.watches)", "sum")
					.getRawMany()
				const watches = watchesQuery[0].sum;

				// Count Likes
				const likes = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("user_videos.liked")
					.where("user_videos.liked = 1")
					.getCount();

				// Count Dislikes
				const dislikes = await userVideoRepository
					.createQueryBuilder("user_videos")
					.select("user_videos.liked")
					.where("user_videos.liked = -1")
					.getCount();

				// Get Video owner username
				const userVideoOwner = await userVideoRepository.findOne({ where: { video_id, is_owner: true } });
				const videoOwner = await userRepository.findOne(userVideoOwner!.user_id);
				const username = videoOwner!.first_name.concat(" ", videoOwner!.last_name);
				console.log(username);



				return {};
			} else {
				throw new Error("Erro ao resgatar repositório de vídeo.");
			}
		} catch (err) {
			throw new Error(err);
		}

	}
}

export default WatchVideoService;
