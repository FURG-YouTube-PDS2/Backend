import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';

interface Request {
	email: string;
	password: string;
}

interface Response {
	user: User;
	token: string;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<Response> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({ where: { email, password } });
		// console.log(user);
		if (!user) {
			throw new Error(0); // 'Combinação de email e senha incorreta.'
		}

		// user.password - Senha criptografada
		// password - Senha não-criptografada

		/*const passwordMatched = await compare(password, user.password);

		if (!passwordMatched){
		 throw new Error('Combinação de email e senha incorreta.');
		}*/

		// A partir daqui o usuário está autenticado

		if (user.verified) {
			const { secret, expiresIn } = authConfig.jwt;

			// 1 Parâmetro: Infos sobre usuário (permissoes, dados)
			const token = sign({}, secret, {
				subject: user.id,
				expiresIn,
				// explorar refresh token posteriormente
			});

			return {
				user,
				token,
			};
		} else {
			throw new Error(1); // 'Email não vefiricado.
		}
	}
}

export default AuthenticateUserService;
