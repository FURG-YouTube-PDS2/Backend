import { Router } from 'express';

import User from '../models/User';
import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

// Rota para desenvolvimento
usersRouter.get('/', ensureAuthenticated, async(request, response) => {
    const userRepo = getRepository(User);
    const users = await userRepo.find();
    response.json(users);
});

usersRouter.post('/signup', async(request, response) => {
    try {
        const { first_name, last_name, email, password, created_at } = request.body;

        const createUser = new CreateUserService();

        const userData = await createUser.execute({
          first_name,
          last_name,
          email,
          password,
          created_at
        });

        delete userData.password;

        return response.json(userData);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});


export default usersRouter;
