import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';
import PlaylistVideo from '../../models/PlaylistVideo';
import Video from '../../models/Video';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
	id_target: string;
}

class GetPlaylistsService {
	public async execute({ token, id_target }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const playlistVideoRepo = getRepository(PlaylistVideo);
			const VideoRepo = getRepository(Video);
			if (playlistRepository) {
				var id = checkJwt(token).sub;
				if (id === id_target) {
					id_target = '';
				}
				if (id_target === '') {
					const user_id = checkJwt(token).sub;
					const data = await playlistRepository.find({
						select: ['id', 'name', 'created_at'],
						where: { user_id: user_id },
						order: { created_at: 'ASC' },
					});
					var newData = Array();
					for (let i = 0; i < data.length; i++) {
						const allVideos = await playlistVideoRepo.find({
							select: ['video_id'],
							where: { playlist_id: data[i].id },
						});
						if (allVideos.length !== 0) {
							var videoThumb = await VideoRepo.findOne({
								select: ['thumb'],
								where: { id: allVideos[0].video_id },
							});
						} else {
							var videoThumb = { thumb: 'undefined' };
						}

						newData.push({
							id: data[i].id,
							name: data[i].name,
							created_at: data[i].created_at,
							all_videos: allVideos.length,
							thumb: videoThumb?.thumb,
						});
					}
					return newData;
				} else {
					const data = await playlistRepository.find({
						select: ['id', 'name', 'created_at'],
						where: { user_id: id_target, public: true },
					});
					var newData = Array();
					for (let i = 0; i < data.length; i++) {
						const allVideos = await playlistVideoRepo.find({
							select: ['video_id'],
							where: { playlist_id: data[i].id },
						});
						if (allVideos.length !== 0) {
							var videoThumb = await VideoRepo.findOne({
								select: ['thumb'],
								where: { id: allVideos[0].video_id },
							});
						} else {
							var videoThumb = { thumb: 'undefined' };
						}
						newData.push({
							id: data[i].id,
							name: data[i].name,
							created_at: data[i].created_at,
							all_videos: allVideos.length,
							thumb: videoThumb?.thumb,
						});
					}
					return newData;
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
