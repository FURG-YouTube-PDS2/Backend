import { Response as res } from 'express';
import { getRepository, getManager } from 'typeorm';

import Playlist from '../../models/Playlist';
import PlaylistVideo from '../../models/PlaylistVideo';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	video_id: string;
}

class GetPlaylistsAVideo {
	public async execute({ token, video_id }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const playlistVideoRepo = getRepository(PlaylistVideo);
			const user_id = checkJwt(token).sub;
			if (playlistRepository) {
				var data = new Array();
				const playlists = await playlistRepository.find({
					where: { user_id: user_id },
				});
				const locked = await playlistVideoRepo.find({
					select: ['playlist_id'],
					where: { user_id, video_id },
				});
				var id = '';
				var aux = [];
				for (let i = 0; i < playlists.length; i++) {
					if (playlists[i].name !== 'Vídeos curtidos') {
						aux.push(playlists[i]);
					} else {
						id = playlists[i].id;
					}
				}

				data.push(aux);
				var aux = [];
				for (let i = 0; i < locked.length; i++) {
					if (id !== locked[i].playlist_id) {
						aux.push(locked[i].playlist_id);
					}
				}
				data.push(aux);
				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetPlaylistsAVideo;
