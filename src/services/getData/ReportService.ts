import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import User from '../../models/User';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	video_id: string;
	report_text: string;
	report_option: string;
}

class ReportService {
	public async execute({
		token,
		video_id,
		report_text,
		report_option,
	}: Request): Promise<object> {
		try {
			const videoUserRepository = getRepository(UserVideo);
			const user_id = checkJwt(token).sub;

			const videoInfo = await videoUserRepository.findOne({
				where: { user_id: user_id, video_id: video_id },
			});
			if (videoInfo) {
				const is_liked = await videoUserRepository.save({
					id: videoInfo.id,
					report_option,
					reported: true,
					report_text,
				});
				const Data = {
					status: 1,
				};

				return Data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ReportService;
