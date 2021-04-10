import { Response as res } from 'express';
import { getRepository } from 'typeorm';

import Notification from '../../models/Notification';

interface Request {
	nots: [];
}

class ViewsNotsService {
	public async execute({ nots }: Request): Promise<object> {
		try {
			const notificationRepo = getRepository(Notification);
			if (notificationRepo) {
				for (let i = 0; i < nots.length; i++) {
					await notificationRepo.save({
						id: nots[i].id,
						readed: true,
					});
				}
				return { status: 1 };
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default ViewsNotsService;
