import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';

interface Request {
	video_id: string;
}

// Não finalizado, verificar funcionamento e aprimorar erro handling
class GetPlayerService {
	public async execute({ video_id }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);

			const video = await videoRepository.findOne({ where: { id: video_id } });
			// Aqui temos video_id, title, file e description
			if (video) {
				// AINDA FALTA AVATAR
				const data = {
					file: video.file,
				};

				return data;
			} else {
				throw new Error('Erro ao resgatar O vídeo.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetPlayerService;
