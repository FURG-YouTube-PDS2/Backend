import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import PlaylistVideo from '../../models/PlaylistVideo';
import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	playlist_id: string;
	token: string;
}

class DeletePlaylistService {
	public async execute({ playlist_id, token }: Request): Promise<object> {
		try {
			const playVideoRepository = getRepository(PlaylistVideo);
			const playlistRepository = getRepository(Playlist);
			const user_id = checkJwt(token).sub;

			if (playVideoRepository && playlistRepository) {
				var play = await playlistRepository.findOne({
					select: ['user_id'],
					where: { id: playlist_id },
				});
				if (play?.user_id === user_id) {
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

export default DeletePlaylistService;
