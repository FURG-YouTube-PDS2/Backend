import { Router } from 'express';

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

		return response.json({ status: 1, token });
	} catch (err) {
		return response
			.status(400)
			.json({ status: 0, errorName: err.name, errorMessage: err.message });
	}
});

export default sessionsRouter;
