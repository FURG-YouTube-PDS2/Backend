import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import PlaylistVideo from '../../models/PlaylistVideo';
import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	playlist_id: string;
	position: number;
	video_id: string;
}

class AddVideoPlaylist {
	public async execute({ position, token, video_id, playlist_id }: Request): Promise<object> {
		try {
			const playVideoRepository = getRepository(PlaylistVideo);
			const playlistRepository = getRepository(Playlist);
			const user_id = checkJwt(token).sub;

			if (position !== 0) {
				const data = await playVideoRepository.find({
					where: { playlist_id, user_id },
				});
				position = data.length;
			}
			const created_at = new Date();
			console.log(video_id);
			// Aqui temos video_id, title, file e description
			if (playVideoRepository) {
				await playlistRepository.save({
					id: playlist_id,
					created_at,
				});
				const plt = await playVideoRepository.save({
					position,
					playlist_id,
					video_id,
					created_at,
					user_id,
				});
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default AddVideoPlaylist;
