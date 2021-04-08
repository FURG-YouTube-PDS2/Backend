import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Tags from '../../models/Tags';

import checkJwt from '../../middlewares/checkJwt';

interface Request {}

class GetRecommendedService {
	public async execute({}: Request): Promise<object> {
		try {
			const tagsRepo = getRepository(Tags);

			if (tagsRepo) {
				const data = await tagsRepo.find({
					select: ['id', 'name'],
				});
				return data;
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default GetRecommendedService;
