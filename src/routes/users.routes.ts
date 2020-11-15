import { Router } from 'express';

import User from '../models/User';
import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

usersRouter.get('/', async(request, response) => {
    const userRepo = getRepository(User);
    const users = await userRepo.find();
    response.json(users);
});

usersRouter.post('/', async(request, response) => {
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

        return response.json({ message: "post"});
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});


export default usersRouter;
