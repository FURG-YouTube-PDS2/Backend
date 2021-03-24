import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';
import User from '../models/User';

import GetToken from '../services/GetToken';
import CreatePlaylistService from '../services/playlist/CreatePlaylistService';

import { create } from 'domain';
import { parse } from 'path';
import Mail from '../middlewares/sendMail';
import { id } from 'date-fns/locale';
import checkJwt from '../middlewares/checkJwt';

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
		const playlist = new CreatePlaylistService();
		var name = 'Assitir mais tarde';
		var is_public = false;
		var tokenService = new GetToken();
		var token = await tokenService.execute({ user_id: id });
		var fixed = true;
		var video_id = '';
		var statusList;
		var likedList;
		statusList = await playlist.execute({ name, is_public, token, fixed, video_id });
		name = 'Vídeos curtidos';
		likedList = await playlist.execute({ name, is_public, token, fixed, video_id });

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

emailRouter.post('/edit_pass', async (request, response) => {
	try {
		const { id, password } = request.body;
		console.log(id);
		const nwId = id.id;
		console.log(password);
		const userRepository = getRepository(User);

		const user = await userRepository.findOne({ where: { id } });
		console.log(user);
		if (!user) {
			throw new Error('Usuario Não Existe.');
		}
		const status = 1;

		await userRepository.save({
			id,
			password,
		});

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

emailRouter.post('/send', async (request, response) => {
	const { email, token, cond } = request.body;
	var id = '';
	if (token === '') {
		const userRepo = getRepository(User);
		const user = await userRepo.findOne({ email });
		id = user?.id;
	} else {
		id = checkJwt(token).sub;
	}
	// console.log(id);
	let result = Mail.sendMail(email, id, cond);

	return response.status(200).json({ status: 1 });
});

export default emailRouter;
