import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';
import User from '../models/User';

import { create } from 'domain';
import { parse } from 'path';
import Mail from '../middlewares/sendMail';
import { id } from 'date-fns/locale';

const emailRouter = Router();

emailRouter.post('/confirm_email', async (request, response) => {
	try {
		const { id } = request.body;
		const userRepository = getRepository(User);

		const user = await userRepository.findOne({ where: { id } });
		if (!user) {
			throw new Error('Usuario Não Existe.');
		}
		const status = 1;
		const verification = true;

		await userRepository.save({
			id,
			verified: verification,
		});

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

emailRouter.post('/send', async (request, response) => {
	const { email, id, cond } = request.body;
	
	let result = Mail.sendMail(email, id, cond);

	return response.status(200).json({ status: 1 });
});

export default emailRouter;
