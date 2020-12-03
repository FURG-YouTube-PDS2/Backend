import User from '../models/User';
import { getRepository } from 'typeorm';

interface Request {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	avatar: string;
}

class CreateUserService {
	public async execute({ first_name, last_name, email, password, avatar }: Request): Promise<number> {
		// Recebe todos os metodos de repositorio
		//const customRepository = getCustomRepository()
		const userRepository = getRepository(User);


		const created_at = new Date();
		const updated_at = new Date();

		const userData = userRepository.create({
			first_name,
			last_name,
			email,
			password,
			created_at,
			updated_at,
			avatar
		});

		// efetivamente salva o usuario no banco de dados
		await userRepository.save(userData);

		return 1;
	}
}

export default CreateUserService;
