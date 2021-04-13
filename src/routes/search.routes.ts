import { Router } from 'express';

import SearchService from '../services/SearchService';

const searchRouter = Router();

searchRouter.post('/', async (req, res) => {
	try {
		const { input } = req.body;

		const search = new SearchService();

		if (typeof input !== 'undefined') {
			// results = [videos, users]
			const results = await search.execute({ input });

			res.status(200).json(results);
		} else {
			res.send({ error: 'undefined input' });
		}
	} catch (err) {
		console.log(err);
	}
});

export default searchRouter;
