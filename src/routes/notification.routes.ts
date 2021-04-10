import { Router } from 'express';

import { getRepository } from 'typeorm';

import GetNotificationService from '../services/notification/GetNotificationService';
import ViewsNotsService from '../services/notification/ViewsNotsService';

const notificationRouter = Router();

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// commentsRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {

notificationRouter.post('/get', async (req, res) => {
	try {
		var { token } = req.body;
		// console.log(req.body);
		if (typeof token !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (token) {
			const notif = new GetNotificationService();

			const status = await notif.execute({ token });

			res.status(200).json(status);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

notificationRouter.post('/edit', async (req, res) => {
	try {
		var { nots } = req.body;

		if (nots) {
			const notif = new ViewsNotsService();

			const status = await notif.execute({ nots });

			res.status(200).json(status);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});
export default notificationRouter;
