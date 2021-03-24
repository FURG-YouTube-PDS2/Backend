import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';
import PlaylistVideo from '../../models/PlaylistVideo';
import Video from '../../models/Video';

import checkJwt from '../../middlewares/checkJwt';
import DescriptionVideoService from '../videos/DescriptionVideoService';

interface Request {
	token: string;
	playlist_id: string;
}

class GetAPlaylistService {
	public async execute({ token, playlist_id }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const playlistVideoRepo = getRepository(PlaylistVideo);
			const VideoRepo = getRepository(Video);
			const user_id = checkJwt(token).sub;

			if (playlistRepository) {
				const dataPlaylist = await playlistRepository.findOne({
					select: ['id', 'name', 'public', 'fixed', 'created_at'],
					where: { user_id: user_id, id: playlist_id },
				});
				const allVideos = await playlistVideoRepo.find({
					select: ['position', 'video_id'],
					where: { playlist_id },
				});
				var videos = new Array();
				const descVideo = new DescriptionVideoService();
				for (let i = 0; i < allVideos.length; i++) {
					videos.push(await descVideo.execute({ video_id: allVideos[i].video_id }));
				}
				return {
					dataPlaylist,
					videos,
				};
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetAPlaylistService;
