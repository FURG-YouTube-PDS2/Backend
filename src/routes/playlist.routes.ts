import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreatePlaylistService from '../services/playlist/CreatePlaylistService';
import AddVideoPlaylist from '../services/playlist/AddVideoPlaylist';
import DeletePlaylistService from '../services/playlist/DeletePlaylistService';
import GetAPlaylistService from '../services/playlist/GetAPlaylistService';
import GetPlaylistsService from '../services/playlist/GetPlaylistsService';
import EditPlaylistService from '../services/playlist/EditPlaylistService';
import RemoveVideoService from '../services/playlist/RemoveVideoService';

const playlistRouter = Router();

playlistRouter.post('/created', async (req, res) => {
	try {
		const { name, is_public, token, video_id, fixed } = req.body;
		const Playlist = new CreatePlaylistService();
		const statusPlaylist = await Playlist.execute({ name, is_public, token, fixed, video_id });

		if (video_id !== '') {
			const addVideo = new AddVideoPlaylist();
			const statusAdd = await addVideo.execute({
				position: statusPlaylist.position,
				token,
				video_id,
				playlist_id: statusPlaylist.id,
			});
			res.status(200).json(statusAdd);
		} else {
			res.status(200).json(statusPlaylist);
		}
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/add', async (req, res) => {
	try {
		const { token, video_id, playlist_id } = req.body;

		const addVideo = new AddVideoPlaylist();
		const statusAdd = await addVideo.execute({
			position: '1',
			token,
			video_id,
			playlist_id,
		});
		res.status(200).json(statusAdd);
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/edit', async (req, res) => {
	try {
		const { name, is_public, token, videos } = req.body;

		const edit = new EditPlaylistService();
		const status = await edit.execute({ name, is_public, token, videos });

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/delete', async (req, res) => {
	try {
		const { playlist_id } = req.body;

		const deletePlaylist = new DeletePlaylistService();
		const status = await deletePlaylist.execute({ playlist_id });

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});
playlistRouter.post('/remove', async (req, res) => {
	try {
		const { playlist_id, video_id } = req.body;

		const removeVideo = new RemoveVideoService();
		const status = await removeVideo.execute({ playlist_id, video_id });

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/get', async (req, res) => {
	try {
		const { token, id_target } = req.body;
		const Playlists = new GetPlaylistsService();
		const status = await Playlists.execute({ token, id_target });

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});

playlistRouter.post('/list', async (req, res) => {
	try {
		const { token, playlist_id } = req.body;

		const Playlist = new GetAPlaylistService();
		const status = await Playlist.execute({ token, playlist_id });

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});

export default playlistRouter;
