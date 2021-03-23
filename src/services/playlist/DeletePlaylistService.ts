import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import PlaylistVideo from '../../models/PlaylistVideo';
import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	playlist_id: string;
}

class DeletePlaylistService {
	public async execute({ playlist_id }: Request): Promise<object> {
		try {
			const playVideoRepository = getRepository(PlaylistVideo);
			const playlistRepository = getRepository(Playlist);

			if (playVideoRepository && playlistRepository) {
				await playlistRepository.delete({
					id: playlist_id,
				});
				const data = await playVideoRepository.find({
					where: { playlist_id: playlist_id },
				});
				for (let i = 0; i < data.length; i++) {
					await playVideoRepository.delete({
						id: data[i].id,
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

export default DeletePlaylistService;
