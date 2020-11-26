import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

sessionsRouter.post('/', async(request, response) => {
    try {
        const { email, password } = request.body;

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        return response.json({ status:1, token });
    } catch (err) {
        return response.status(400).json({ status:0, errorName: err.name, errorMessage: err.message });
    }
});


export default sessionsRouter;
