import { Router } from 'express';

import { getRepository } from 'typeorm';

import statisticChannelService from '../services/statistic/statisticChannelService';

const statisticRouter = Router();

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// commentsRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {

statisticRouter.post('/get', async (req, res) => {
	try {
		var { token } = req.body;
		// console.log(req.body);
		if (typeof token !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (token) {
			const statistic = new statisticChannelService();

			const status = await statistic.execute({ token });

			res.status(200).json(status);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});
export default statisticRouter;
