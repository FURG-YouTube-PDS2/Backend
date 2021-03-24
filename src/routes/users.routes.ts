import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';

import CreateUserService from '../services/user/CreateUserService';
import EditUserService from '../services/user/EditUserService';
import CreatePlaylistService from '../services/playlist/CreatePlaylistService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import SubscriptionService from '../services/user/SubscriptionService';
import GetToken from '../services/GetToken';

import User from '../models/User';
import s3Upload from '../middlewares/awsS3Upload';
import uploadWithId from '../middlewares/awsUpload';

import { create } from 'domain';
import { parse } from 'path';
import checkJwt from '../middlewares/checkJwt';
import Mail from '../middlewares/sendMail';

const usersRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

// Rota para desenvolvimento
usersRouter.post('/', ensureAuthenticated, async (request, response) => {
	const userRepo = getRepository(User);
	const users = await userRepo.find();
	return response.json(users);
});

//ver perfil
usersRouter.post('/profile', async (request, response) => {
	const { token } = request.body;
	const id = checkJwt(token).sub;
	const userRepo = getRepository(User);
	const userProfile = await userRepo.findOne({ id });

	return response.json(userProfile);
});

// Rota cadastro
usersRouter.post('/signup', async (request, response) => {
	try {
		const {
			avatar,
			old_img,
			username,
			email,
			password,
			birthdate,
			gender,
			phone,
		} = request.body;

		var file;
		if (!avatar) {
			file = old_img;
		} else {
			file = avatar;
		}
		// console.log(file);
		const createUser = new CreateUserService();

		const id = await createUser.execute({
			username,
			email,
			password,
			birthdate,
			avatar: file,
			gender,
			phone,
		});
		if (id != '') {
			let result = Mail.sendMail(email, id, 0);
			return response.status(200).json({ status: 1 });
		}
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

// Rota editar usuário s3Upload({}).single('avatar'),
usersRouter.put('/profile/edit', async (request, response) => {
	try {
		const {
			token,
			avatar,
			old_img,
			username,
			email,
			password,
			birthdate,
			gender,
			phone,
		} = request.body;

		// var avatar;
		// console.log(request.body);
		// const { file } = request;

		var file;

		if (avatar == null) {
			file = old_img;
		} else {
			file = avatar;
		}

		const editUser = new EditUserService();
		const isEdited = await editUser.execute({
			token,
			avatar: file,
			username,
			email,
			birthdate,
			password,
			gender,
			phone,
		});

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

usersRouter.post('/subs', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		var { token, target_id } = req.body;
		if (typeof target_id !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (token && target_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const Subs = new SubscriptionService();

			const statusSubs = await Subs.execute({ token, target_id });

			res.status(200).json(statusSubs);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default usersRouter;
