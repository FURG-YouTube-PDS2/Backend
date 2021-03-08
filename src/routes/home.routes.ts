import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';

import GetVideosService from '../services/GetVideosService';
import RiseVideosService from '../services/RiseVideosService';

const homeRouter = Router();

homeRouter.post('/get', async (req, res) => {
	try {
		const { numberSkip } = req.body;

		const video = new GetVideosService();

		const data = await video.execute({ numberSkip });

		res.status(200).json(data);
	} catch (err) {
		console.log(err);
	}
});

homeRouter.post('/rise', async (req, res) => {
	try {
		// const {  } = req.body;

		const video = new RiseVideosService();

		const data = await video.execute({});

		res.status(200).json(data);
	} catch (err) {
		console.log(err);
	}
});
export default homeRouter;
