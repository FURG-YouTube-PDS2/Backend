import { getRepository } from 'typeorm';
import uploadWithId from '../../middlewares/awsUpload';

import checkJwt from '../../middlewares/checkJwt';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';

interface Request {
	token: string;
	title: string;
	description?: string;
	file: string;
	privacy: boolean;
	thumb: string;
	video_id: string;
}

class EditVideoDataService {
	public async execute({
		token,
		description,
		title,
		privacy,
		thumb,
		file,
		video_id,
	}: Request): Promise<number> {
		try {
			const videoRepository = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);

			const user_id = checkJwt(token).sub;

			const created_at = new Date();

			// Add entrada no banco de dados

			if (videoRepository) {
				if (file === null) {
					if (thumb === null) {
						const video = await videoRepository.save({
							id: video_id,
							description,
							title,
							privacy,
						});
					} else {
						const video = await videoRepository.save({
							id: video_id,
							description,
							title,
							privacy,
							thumb,
						});
					}
				} else if (thumb === null) {
					const video = await videoRepository.save({
						id: video_id,
						file,
						description,
						title,
						privacy,
					});
				} else {
					const video = await videoRepository.save({
						id: video_id,
						file,
						description,
						title,
						privacy,
						thumb,
					});
				}
				// const video = await videoRepository.save({
				// 	file,
				// 	description,
				// 	title,
				// 	created_at,
				// 	privacy,
				// 	thumb,
				// });

				// // LEMBRAR: E SE ISSO DER ERRO? JÁ VAI TER SALVO NO BANCO ANTERIOR E O VIDEO ESTARA NO SERVIDOR
				// await userVideoRepository.save({
				// 	user_id,
				// 	video_id: video.id,
				// 	liked: 0,
				// 	reported: false,
				// 	report_option: '',
				// 	report_text: '',
				// 	watches: 0,
				// 	is_owner: true,
				// 	created_at,
				// });
				return 1;
			} else {
				throw new Error('Erro ao resgatar repositório de vídeo.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default EditVideoDataService;
