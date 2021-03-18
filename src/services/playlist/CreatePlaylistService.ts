import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	name: string;
	is_public: boolean;
	fixed: boolean;
	video_id: string;
}

class CreatePlaylistService {
	public async execute({ name, is_public, token, fixed, video_id }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const user_id = checkJwt(token).sub;

			const created_at = new Date();

			// Aqui temos video_id, title, file e description
			if (playlistRepository) {
				const plt = await playlistRepository.save({
					name,
					public: is_public,
					fixed,
					created_at,
					user_id,
				});

				if (video_id !== '') {
					const data = await playlistRepository.findOne({
						where: { name, user_id },
					});
					var size = playlistRepository.count();
					return { id: data?.id, position: size };
				} else {
					return { status: 1 };
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default CreatePlaylistService;
