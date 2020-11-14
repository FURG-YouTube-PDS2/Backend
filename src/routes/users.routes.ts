import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

usersRouter.get('/', async(request, response) => {
    //const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    //const appointments = await appointmentsRepository.find();

    return response.json({ message: 'meu cu' });
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
