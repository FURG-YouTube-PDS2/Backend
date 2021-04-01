import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import PlaylistVideo from '../../models/PlaylistVideo';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	playlist_id: string;
	video_id: string;
}

class RemoveVideoService {
	public async execute({ playlist_id, video_id }: Request): Promise<object> {
		try {
			const playVideoRepository = getRepository(PlaylistVideo);

			if (playVideoRepository) {
				const data = await playVideoRepository.findOne({
					where: { playlist_id: playlist_id, video_id },
				});
				await playVideoRepository.delete({
					id: data?.id,
				});
				const videos = await playVideoRepository.find({
					where: { playlist_id: playlist_id },
					order: { position: 'ASC' },
				});
				for (let i = 0; i < videos.length; i++) {
					await playVideoRepository.save({
						id: videos[i].id,
						position: i,
						playlist_id,
					});
				}
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default RemoveVideoService;
