import { Router } from 'express';

import DescriptionChannelService from '../services/channel/DescriptionChannelService';
import GetVideoService from '../services/channel/GetVideoService';

const channelRouter = Router();

channelRouter.post('/info', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		const { user_id, token } = req.body;
		if (typeof user_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do usuario e token deve ser uma string.');
		}
		if (user_id || token) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const description = new DescriptionChannelService();

			const status = await description.execute({ user_id, token });

			res.status(200).json(status);
		} else {
			throw new Error('Token ou Id não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

channelRouter.post('/videos', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		const { user_id, token } = req.body;
		if (typeof user_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (user_id || token) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const video = new GetVideoService();

			const status = await video.execute({ user_id, token });

			res.status(200).json(status);
		} else {
			throw new Error('Token ou Id não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default channelRouter;
