import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Video from '../../models/Video';
import UserVideo from '../../models/UserVideo';
import User from '../../models/User';
import Playlist from '../../models/Playlist';
import PlaylistVideo from '../../models/PlaylistVideo';
import GetPlaylistsService from '../playlist/GetPlaylistsService';
import GetAPlaylistService from '../playlist/GetAPlaylistService';
import DescriptionVideoService from '../videos/DescriptionVideoService';

import checkJwt from '../../middlewares/checkJwt';

interface Request {
	token: string;
}

class GetLibraryService {
	public async execute({ token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const userVideoRepository = getRepository(UserVideo);
			const playlistRepository = getRepository(Playlist);
			const playlistVideoRepo = getRepository(PlaylistVideo);
			const user_id = checkJwt(token).sub;

			if (videoRepository && userRepository && userVideoRepository) {
				const id_videos_lik = await playlistRepository.findOne({
					select: ['id', 'name'],
					where: { name: 'Vídeos curtidos', user_id: user_id },
				});
				const id_videos_later = await playlistRepository.findOne({
					select: ['id', 'name'],
					where: { name: 'Assitir mais tarde', user_id: user_id },
				});

				const allVideosLik = await playlistVideoRepo.find({
					select: ['position', 'video_id'],
					where: { playlist_id: id_videos_lik?.id },
					take: 10,
					order: { position: 'ASC' },
				});

				const allVideosLat = await playlistVideoRepo.find({
					select: ['position', 'video_id'],
					where: { playlist_id: id_videos_later?.id },
					take: 10,
					order: { position: 'ASC' },
				});

				var videos_lik = new Array();
				const descLik = new DescriptionVideoService();
				for (let i = 0; i < allVideosLik.length; i++) {
					videos_lik.push(await descLik.execute({ video_id: allVideosLik[i].video_id }));
				}

				var videos_lat = new Array();
				const descLat = new DescriptionVideoService();
				for (let i = 0; i < allVideosLat.length; i++) {
					videos_lat.push(await descLat.execute({ video_id: allVideosLat[i].video_id }));
				}

				// var playlists = new GetPlaylistsService();
				// var dataPlaylist = await playlists.execute({ token, id_target: '' });
				const dataPlaylist = await playlistRepository.find({
					select: ['id', 'name', 'created_at'],
					where: { user_id: user_id },
					order: { created_at: 'ASC' },
				});
				var newData = Array();
				for (let i = 0; i < dataPlaylist.length; i++) {
					const allVideos = await playlistVideoRepo.find({
						select: ['video_id'],
						where: { playlist_id: dataPlaylist[i].id },
					});
					if (allVideos.length !== 0) {
						var videoThumb = await videoRepository.findOne({
							select: ['thumb'],
							where: { id: allVideos[0].video_id },
						});
					} else {
						var videoThumb = { thumb: 'undefined' };
					}

					newData.push({
						id: dataPlaylist[i].id,
						name: dataPlaylist[i].name,
						created_at: dataPlaylist[i].created_at,
						all_videos: allVideos.length,
						thumb: videoThumb?.thumb,
					});
				}
				var data = Array();
				for (let i = 0; i < newData.length; i++) {
					if (newData[i].name !== 'Assitir mais tarde') {
						if (newData[i].name !== 'Vídeos curtidos') {
							data.push(newData[i]);
						}
					}
				}

				return { id_videos_lik, videos_lik, id_videos_later, videos_lat, data };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetLibraryService;
