import { Router } from 'express';

import { getRepository } from 'typeorm';

import GetRecommendedService from '../services/recommended/GetRecommendedService';
import RecVideosService from '../services/recommended/RecVideosService';

const recommendedRouter = Router();

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// commentsRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {

recommendedRouter.post('/get', async (req, res) => {
	try {
		const tag = new GetRecommendedService();

		const status = await tag.execute({});

		res.status(200).json(status);
	} catch (err) {
		console.log(err);
	}
});

recommendedRouter.post('/videos', async (req, res) => {
	try {
		var { video_id } = req.body;
		// console.log(req.body);
		if (typeof video_id !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (video_id) {
			const video = new RecVideosService();

			const data = await video.execute({ video_id });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default recommendedRouter;
