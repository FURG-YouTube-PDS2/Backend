import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Playlist from '../../models/Playlist';
import User from '../../models/User';
import PlaylistVideo from '../../models/PlaylistVideo';
import Video from '../../models/Video';

import DescriptionVideoPService from './DescriptionVideoPService';

interface Request {
	playlist_id: string;
}

class WatchPlaylistService {
	public async execute({ playlist_id }: Request): Promise<object> {
		try {
			const playlistRepository = getRepository(Playlist);
			const playlistVideoRepo = getRepository(PlaylistVideo);
			const VideoRepo = getRepository(Video);
			const userRepository = getRepository(User);

			if (playlistRepository) {
				const dataPlaylist = await playlistRepository.findOne({
					select: ['id', 'name', 'public', 'fixed', 'created_at', 'user_id'],
					where: { id: playlist_id },
				});

				const allVideos = await playlistVideoRepo.find({
					select: ['position', 'video_id'],
					where: { playlist_id },
				});
				console.log(allVideos);

				const user_info = await userRepository.findOne({
					select: ['id', 'username'],
					where: { id: dataPlaylist?.user_id },
				});

				var videos = new Array();
				const descVideo = new DescriptionVideoPService();
				for (let i = 0; i < allVideos.length; i++) {
					videos.push(await descVideo.execute({ video_id: allVideos[i].video_id }));
				}
				var data = {
					title: dataPlaylist?.name,
					channel: user_info?.username,
					channel_id: user_info?.id,
				};
				console.log(data);
				console.log(videos);
				return {
					data,
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

export default WatchPlaylistService;
