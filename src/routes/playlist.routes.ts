import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreatePlaylistService from '../services/playlist/CreatePlaylistService';
import AddVideoPlaylist from '../services/playlist/AddVideoPlaylist';

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

playlistRouter.post('/edit', async (req, res) => {
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

playlistRouter.post('/delete', async (req, res) => {
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

playlistRouter.post('/list', async (req, res) => {
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

export default playlistRouter;
