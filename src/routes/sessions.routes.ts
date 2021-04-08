import { Router } from 'express';
import { getRepository } from 'typeorm';

import Nintube from '../models/Nintube';
import AuthenticateUserService from '../services/AuthenticateUserService';
import Mail from '../middlewares/sendMail';

const sessionsRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

sessionsRouter.post('/', async (request, response) => {
	try {
		const { email, password } = request.body;
		const authenticateUser = new AuthenticateUserService();

		const { user, token } = await authenticateUser.execute({
			email,
			password,
		});

		// if (token == '') {
		//     const id = user!.id;
		//     let result = Mail.sendMail(email, id, 0);
		//     return response.json({ status:0, error: "Email não verificado" });
		// }
		return response.json({ status: 1, token, avatar: user!.avatar });
	} catch (err) {
		var errorMessage;
		if (err.message == 1) {
			errorMessage = 'Email não verificado.';
			return response.json({ status: 0, errorMessage });
		} else {
			return response.status(400).json({ status: 0 });
		}
	}
});

export default sessionsRouter;
