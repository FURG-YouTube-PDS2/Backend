import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import { getRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import EditUserService from '../services/EditUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import User from '../models/User';
import { create } from 'domain';


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
	const { id } = request.body;
	const userRepo = getRepository(User);
	const userProfile = await userRepo.findOne({ id });
	return response.json(userProfile);
});

// Rota cadastro
usersRouter.post('/signup', async (request, response) => {
	try {
		const { username, email, password, birthdate, avatar } = request.body;

		const createUser = new CreateUserService();

		const created = await createUser.execute({
			username,
			email,
			password,
			birthdate,
			avatar
		});

		if (created) {
			return response.status(200).json({ status: 1 });
		}
	} catch (err) {
		return response.status(400).json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

// Rota editar usuário
usersRouter.put('/profile/edit', async (request, response) => {
	try {
		const { token, username, email, password, birthdate } = request.body;

		const editUser = new EditUserService();
		const isEdited = await editUser.execute({ token, username, email, birthdate, password });

		return response.status(200).json({ status: 1 });
	} catch (err) {
		return response.status(400).json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});


export default usersRouter;
