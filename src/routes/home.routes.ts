import { Router } from 'express';

import { getRepository } from 'typeorm';

import GetVideosService from '../services/listVideos/GetVideosService';
import RiseVideosService from '../services/listVideos/RiseVideosService';
import HistoricService from '../services/listVideos/HistoricService';
import GetSubsVideos from '../services/listVideos/GetSubsVideos';
import GetLibraryService from '../services/listVideos/GetLibraryService';

const homeRouter = Router();

homeRouter.post('/get', async (req, res) => {
	try {
		const { numberSkip, token } = req.body;

		const video = new GetVideosService();

		const data = await video.execute({ numberSkip, token });

		res.status(200).json(data);
	} catch (err) {
		console.log(err);
	}
});

homeRouter.post('/rise', async (req, res) => {
	try {
		const { numberSkip } = req.body;

		const video = new RiseVideosService();

		const data = await video.execute({ numberSkip });

		res.status(200).json(data);
	} catch (err) {
		console.log(err);
	}
});
homeRouter.post('/historic', async (req, res) => {
	try {
		const { numberSkip, token } = req.body;

		if (typeof token !== 'string') {
			throw new Error('token deve ser uma string.');
		}
		if (token) {
			const video = new HistoricService();

			const data = await video.execute({ numberSkip, token });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

homeRouter.post('/subs_videos', async (req, res) => {
	try {
		const { token } = req.body;

		if (typeof token !== 'string') {
			throw new Error('token deve ser uma string.');
		}
		if (token) {
			const video = new GetSubsVideos();

			const data = await video.execute({ token });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

homeRouter.post('/lib_videos', async (req, res) => {
	try {
		const { token } = req.body;

		if (typeof token !== 'string') {
			throw new Error('token deve ser uma string.');
		}
		if (token) {
			const video = new GetLibraryService();

			const data = await video.execute({ token });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});
export default homeRouter;
