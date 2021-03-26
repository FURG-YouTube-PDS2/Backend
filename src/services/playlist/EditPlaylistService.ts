import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';
import PlaylistVideo from '../../models/PlaylistVideo';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	name: string;
	playlist_id: string;
	is_public: boolean;
	videos: [];
}

class EditPlaylistService {
	public async execute({
		name,
		is_public,
		token,
		videos,
		playlist_id,
	}: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const playVideoRepository = getRepository(PlaylistVideo);
			const user_id = checkJwt(token).sub;

			const created_at = new Date();

			// Aqui temos video_id, title, file e description
			if (playlistRepository && playVideoRepository) {
				const plt = await playlistRepository.save({
					id: playlist_id,
					name,
					public: is_public,
					created_at,
					user_id,
				});
				for (let i = 0; i < videos.length; i++) {
					await playVideoRepository.save({
						position: i,
						playlist_id,
						video_id: videos[i].id,
						user_id,
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

export default EditPlaylistService;
