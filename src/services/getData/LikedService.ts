import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import PlaylistVideo from '../../models/PlaylistVideo';
import Playlist from '../../models/Playlist';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	video_id: string;
	liked: number;
}

class LikedService {
	public async execute({ token, video_id, liked }: Request): Promise<object> {
		try {
			const videoUserRepository = getRepository(UserVideo);
			const playVideoRepository = getRepository(PlaylistVideo);
			const playlistRepository = getRepository(Playlist);
			const user_id = checkJwt(token).sub;

			const videoInfo = await videoUserRepository.findOne({
				where: { user_id: user_id, video_id: video_id },
			});
			const created_at = new Date();
			if (videoInfo) {
				// console.log(videoInfo);
				const is_liked = await videoUserRepository.save({
					id: videoInfo.id,
					liked,
				});
				const playlist = await playlistRepository.findOne({
					select: ['id'],
					where: { name: 'Vídeos curtidos', user_id },
				});

				await playlistRepository.save({
					id: playlist?.id,
					created_at,
				});
				if (liked === 1) {
					const data = await playVideoRepository.find({
						where: { playlist_id: playlist?.id, user_id },
					});
					var position = data.length;
					await playVideoRepository.save({
						position,
						playlist_id: playlist?.id,
						video_id,
						created_at,
						user_id,
					});
				} else {
					const plv = await playVideoRepository.findOne({
						where: { playlist_id: playlist?.id, user_id, video_id },
					});
					await playVideoRepository.delete({
						id: plv?.id,
					});
				}
				const Data = {
					status: 1,
				};

				return Data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default LikedService;
