import { getRepository } from 'typeorm';
import uploadWithId from '../../middlewares/awsUpload';

import checkJwt from '../../middlewares/checkJwt';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';

interface Request {
	token: string;
	file: string;
	title: string;
	description?: string;
	privacy: boolean;
	thumb: string;
}

class SendVideoService {
	public async execute({
		token,
		file,
		description,
		title,
		privacy,
		thumb,
	}: Request): Promise<string> {
		try {
			const videoRepository = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);

			const user_id = checkJwt(token).sub;

			const created_at = new Date();
			// console.log('Troquei');

			// Add entrada no banco de dados
			if (videoRepository) {
				const video = await videoRepository.save({
					file,
					description,
					title,
					created_at,
					privacy,
					thumb,
				});

				//(file, type, id, title, extension)
				//uploadWithId(,'video', user_id, title, 'mp4')

				// LEMBRAR: E SE ISSO DER ERRO? JÁ VAI TER SALVO NO BANCO ANTERIOR E O VIDEO ESTARA NO SERVIDOR
				await userVideoRepository.save({
					user_id,
					video_id: video.id,
					liked: 0,
					reported: false,
					report_option: '',
					report_text: '',
					watches: 0,
					is_owner: true,
					created_at,
					last_watch: created_at,
				});

				return video.id;
			} else {
				throw new Error('Erro ao resgatar repositório de vídeo.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default SendVideoService;
