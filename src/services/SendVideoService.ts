import { getRepository } from 'typeorm';

import checkJwt from '../middlewares/checkJwt';

import UserVideo from '../models/UserVideo';
import Video from '../models/Video';

interface Request {
	token: string;
	file_location: string;
	title: string;
	description?: string;
	privacy: boolean;
	thumb: string;
}

class SendVideoService {
	public async execute({
		token,
		file_location,
		description,
		title,
		privacy,
		thumb,
	}: Request): Promise<number> {
		try {
			const videoRepository = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);

			const user_id = checkJwt(token).sub;

			const created_at = new Date();
			// console.log('Troquei');

			// Add entrada no banco de dados
			if (videoRepository) {
				const video = await videoRepository.save({
					file: file_location,
					description,
					title,
					created_at,
					privacy,
					thumb,
				});

				// LEMBRAR: E SE ISSO DER ERRO? JÁ VAI TER SALVO NO BANCO ANTERIOR E O VIDEO ESTARA NO SERVIDOR
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

export default SendVideoService;
