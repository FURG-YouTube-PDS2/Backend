import User from '../models/User';
import { getRepository } from 'typeorm';

import checkJwt from '../middlewares/checkJwt'

// Pode ter ou não os dados, mas o token é obrigatório
interface Request {
	token: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	password?: string;
}

class EditUserService {
	public async execute({ token, first_name, last_name, email, password }: Request): Promise<number> {

		const userRepository = getRepository(User);

		// Verifica o JWT, e já extrai o Id do payload retornado
		const user_id = checkJwt(token).sub;

		const updated_at = new Date();


		// Se encontrar um usuário com o ID no token, substitui as infos.
		// PS: Passar null não limpa o dado, apenas é ignorado.
		if (user_id) {
			await userRepository.save({
				id: user_id,
				first_name,
				last_name,
				password,
				email,
				updated_at,
			});
		} else {
			throw new Error('Usuário não encontrado.');
		}

		return 1;
	}
}

export default EditUserService;
