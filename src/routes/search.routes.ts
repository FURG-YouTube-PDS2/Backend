import { Router } from 'express';

import SearchService from '../services/SearchService';
import SearchChannelService from '../services/search/SearchChannelService';

const searchRouter = Router();

searchRouter.post('/', async (req, res) => {
	try {
		const { input, type, token } = req.body;

		const search = new SearchService();

		if (typeof input !== 'undefined') {
			// results = [videos, users]
			const results = await search.execute({ input, type, token });

			res.status(200).json(results);
		} else {
			res.send({ error: 'undefined input' });
		}
	} catch (err) {
		console.log(err);
	}
});

searchRouter.post('/channel', async (req, res) => {
	try {
		const { input, channel_id, token } = req.body;

		const search = new SearchChannelService();

		if (typeof input !== 'undefined') {
			// results = [videos, users]
			const results = await search.execute({ input, channel_id, token });

			res.status(200).json(results);
		} else {
			res.send({ error: 'undefined input' });
		}
	} catch (err) {
		console.log(err);
	}
});

export default searchRouter;
