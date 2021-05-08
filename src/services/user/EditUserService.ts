import { getRepository } from 'typeorm';

import User from '../../models/User';

import checkJwt from '../../middlewares/checkJwt';

// Pode ter ou não os dados, mas o token é obrigatório
interface Request {
	token: string;
	username?: string;
	email?: string;
	password?: string;
	birthdate?: Date;
	gender?: string;
	phone?: string;
	avatar?: string;
}

class EditUserService {
	public async execute({
		token,
		username,
		email,
		password,
		avatar,
		birthdate,
		phone,
		gender,
	}: Request): Promise<number> {
		const userRepository = getRepository(User);

		// Verifica o JWT, e já extrai o Id do payload retornado
		const user_id = checkJwt(token).sub;

		const updated_at = new Date();

		// Se encontrar um usuário com o ID no token, substitui as infos.
		// PS: Passar null não limpa o dado, apenas é ignorado.
		if (user_id) {
			await userRepository.save({
				id: user_id,
				username,
				password,
				email,
				birthdate,
				updated_at,
				gender,
				avatar,
				phone,
			});
		} else {
			throw new Error('Usuário não encontrado.');
		}

		return 1;
	}
}

export default EditUserService;
