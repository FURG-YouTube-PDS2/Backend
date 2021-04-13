import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreatePlaylistService from '../services/playlist/CreatePlaylistService';
import AddVideoPlaylist from '../services/playlist/AddVideoPlaylist';
import DeletePlaylistService from '../services/playlist/DeletePlaylistService';
import GetAPlaylistService from '../services/playlist/GetAPlaylistService';
import GetPlaylistsService from '../services/playlist/GetPlaylistsService';
import GetPlaylistsAVideo from '../services/playlist/GetPlaylistsAVideo';
import EditPlaylistService from '../services/playlist/EditPlaylistService';
import RemoveVideoService from '../services/playlist/RemoveVideoService';

const playlistRouter = Router();

playlistRouter.post('/create', async (req, res) => {
	try {
		const { name, is_public, token, video_id } = req.body;
		if (typeof token !== 'string') {
			throw new Error('token deve ser uma string.');
		}
		if (token) {
			const Playlist = new CreatePlaylistService();
			const statusPlaylist = await Playlist.execute({
				name,
				is_public,
				token,
				fixed: false,
				video_id,
			});

			if (video_id !== '') {
				const addVideo = new AddVideoPlaylist();
				const statusAdd = await addVideo.execute({
					position: statusPlaylist.position,
					token,
					video_id,
					playlist_id: statusPlaylist.id,
				});
				var status = {
					status: statusAdd.status,
					id: statusPlaylist.id,
				};
				res.status(200).json(statusAdd);
			} else {
				res.status(200).json(statusPlaylist);
			}
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/add', async (req, res) => {
	try {
		const { token, video_id, playlist_id } = req.body;
		if (
			typeof video_id !== 'string' ||
			typeof token !== 'string' ||
			typeof playlist_id !== 'string'
		) {
			throw new Error('id do video, id da playlist e token deve ser uma string.');
		}

		if (video_id && video_id && playlist_id) {
			const addVideo = new AddVideoPlaylist();
			const statusAdd = await addVideo.execute({
				position: 1,
				token,
				video_id,
				playlist_id,
			});
			res.status(200).json(statusAdd);
		} else {
			throw new Error('Token ou Id do video ou Id da playlist não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/edit', async (req, res) => {
	try {
		const { name, is_public, token, videos, playlist_id } = req.body;
		if (typeof playlist_id !== 'string' || typeof token !== 'string') {
			throw new Error('id da playlist e token deve ser uma string.');
		}
		if (playlist_id && token) {
			const edit = new EditPlaylistService();
			const status = await edit.execute({ name, is_public, token, videos, playlist_id });
			res.status(200).json(status);
		} else {
			throw new Error('Token ou Id da playlist não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/delet', async (req, res) => {
	try {
		const { playlist_id, token } = req.body;
		if (typeof playlist_id !== 'string') {
			throw new Error('id da playlist deve ser uma string.');
		}
		if (playlist_id) {
			const deletePlaylist = new DeletePlaylistService();
			const status = await deletePlaylist.execute({ playlist_id, token });
			res.status(200).json(status);
		} else {
			throw new Error('Id da playlist não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/remove', async (req, res) => {
	try {
		const { playlist_id, video_id } = req.body;
		if (typeof video_id !== 'string' || typeof playlist_id !== 'string') {
			throw new Error('id do video e id da playlist deve ser uma string.');
		}
		if (playlist_id && video_id) {
			const removeVideo = new RemoveVideoService();
			const status = await removeVideo.execute({ playlist_id, video_id });
			res.status(200).json(status);
		} else {
			throw new Error('Id da playlist ou Id do video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/get', async (req, res) => {
	try {
		const { token, id_target } = req.body;
		if (typeof token !== 'string') {
			throw new Error('token deve ser uma string.');
		}
		if (id_target || token) {
			const Playlists = new GetPlaylistsService();
			const status = await Playlists.execute({ token, id_target });

			res.status(200).json(status);
		} else {
			throw new Error('Token e id do user não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/list', async (req, res) => {
	try {
		const { token, playlist_id } = req.body;
		if (typeof playlist_id !== 'string' || typeof token !== 'string') {
			throw new Error('id da playlist e token deve ser uma string.');
		}
		if (token && playlist_id) {
			const Playlist = new GetAPlaylistService();
			const statusPlaylist = await Playlist.execute({ token, playlist_id });
			res.status(200).json(statusPlaylist);
		} else {
			throw new Error('Token e id da playlist não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/list_videoid', async (req, res) => {
	try {
		const { token, video_id } = req.body;
		if (typeof video_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do video e token deve ser uma string.');
		}
		if (token && video_id) {
			const Playlist = new GetPlaylistsAVideo();
			const statusPlaylist = await Playlist.execute({ token, video_id });
			res.status(200).json(statusPlaylist);
		} else {
			throw new Error('Token e id do video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default playlistRouter;
