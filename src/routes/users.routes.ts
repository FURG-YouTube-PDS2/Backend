import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import EditUserService from '../services/EditUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import User from '../models/User';
import s3Upload from '../middlewares/awsS3Upload';

import { create } from 'domain';
import { parse } from 'path';
import checkJwt from '../middlewares/checkJwt';


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
usersRouter.post('/signup', s3Upload({}).single('avatar'), async (request, response) => {
	try {
		const { old_img, username, email, password, birthdate, gender, phone } = request.body;

		const { file } = request;
		var avatar;

		if (file == null){
			avatar = old_img; 
		} else {
			avatar = (file as any).location;
		}

		const createUser = new CreateUserService();

		const created = await createUser.execute({
			username,
			email,
			password,
			birthdate,
			avatar,
			gender,
			phone,
		});

		if (created) {
			return response.status(200).json({ status: 1 });
		}
	} catch (err) {
		return response.status(400).json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

// Rota editar usuário
usersRouter.put('/profile/edit', s3Upload({}).single('avatar'), async (request, response) => {
	try {
		const { old_img, token, username, email, password, birthdate, gender, phone } = request.body;

		var avatar;
		const { file } = request;

		if (file == null){
			avatar = old_img; 
		} else {
			avatar = (file as any).location;
		}

		const editUser = new EditUserService();
		const isEdited = await editUser.execute({ token, avatar, username, email, birthdate, password, gender, phone });

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response.status(400).json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});


export default usersRouter;
