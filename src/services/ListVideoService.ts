import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Comment from '../models/Comment';
import User from '../models/User';
import UserVideo from '../models/UserVideo';
import checkJwt from '../middlewares/checkJwt';
import Video from '../models/Video';

interface Request {
	token: string;
}

class ListVideoService {
	public async execute({ token }: Request): Promise<object> {
		try {
			const userVideoRepo = getRepository(UserVideo);
			const videoRepo = getRepository(Video);
			const user_id = checkJwt(token).sub;
			var data = userVideoRepo.find({
				select: ['video_id'],
				where: { user_id: user_id },
			});
			var resolvedData = await data;
			var newData = Array();

			for (let index = 0; index < resolvedData.length; index++) {
				newData.push(
					await videoRepo.find({
						select: ['id', 'title', 'description', 'thumb', 'created_at', 'privacy'],
						where: { id: resolvedData[index].video_id },
					}),
				);
			}
			var resolvedNewData = newData;
			console.log(resolvedData);
			return resolvedNewData;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ListVideoService;
