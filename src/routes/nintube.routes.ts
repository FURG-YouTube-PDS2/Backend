import { Router } from 'express';
import { getRepository } from 'typeorm';

import Nintube from '../models/Nintube';

const nintubeRouter = Router();

nintubeRouter.post('/imgs', async (req, res) => {
	try {
		const { name } = req.body;
		const ninRepository = getRepository(Nintube);
		const data = await ninRepository.findOne({ where: { nickname: name } });
		res.status(200).send(data?.file);
	} catch (err) {
		console.log(err);
	}
});

export default nintubeRouter;
