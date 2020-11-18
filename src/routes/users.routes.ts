import { Router } from 'express';

// IMPORTE PARA A UTILIZAÇÃO DE DATAS NO CREATED AT
// import { getHours, format } from 'date-fns';
// import pt from 'date-fns/locale/pt-BR';

import User from '../models/User';
import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

// Rota para desenvolvimento
usersRouter.post('/', ensureAuthenticated, async(request, response) => {
    const userRepo = getRepository(User);
    const users = await userRepo.find();
    response.json(users);
});

// Rota cadastro
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

        return response.status(200).json({ status: 1 });
    } catch (err) {
        return response.status(400).json({ status: 0, errorName: err.name, errorMessage: err.message });
    }
});


export default usersRouter;
