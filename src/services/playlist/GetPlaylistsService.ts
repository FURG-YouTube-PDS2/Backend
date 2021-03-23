import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	id_target: string;
}

class GetPlaylistsService {
	public async execute({ token, id_target }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			if (playlistRepository) {
				if (token === '') {
					const data = await playlistRepository.find({
						where: { user_id: id_target },
					});
					return data;
				} else {
					const user_id = checkJwt(token).sub;
					const data = await playlistRepository.find({
						where: { user_id: user_id },
					});
					return data;
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetPlaylistsService;
