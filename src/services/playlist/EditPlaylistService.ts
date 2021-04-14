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
				var play = await playlistRepository.findOne({
					select: ['user_id'],
					where: { id: playlist_id },
				});
				if (play?.user_id === user_id) {
					const plt = await playlistRepository.save({
						id: playlist_id,
						name,
						public: is_public,
						created_at,
						user_id,
					});
					const data = await playVideoRepository.find({
						where: { playlist_id: playlist_id },
					});
					for (let i = 0; i < data.length; i++) {
						await playVideoRepository.delete({
							id: data[i].id,
						});
					}
					for (let i = 0; i < videos.length; i++) {
						await playVideoRepository.save({
							position: i,
							playlist_id,
							video_id: videos[i],
							user_id,
							created_at,
						});
					}

					return { status: 1 };
				} else {
					return { status: 0 };
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default EditPlaylistService;
