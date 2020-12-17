import User from '../models/User';
import { getRepository } from 'typeorm';

import s3Upload from '../middlewares/awsS3Upload';

interface Request {
	username: string;
	email: string;
	password: string;
	avatar: string;
	birthdate: Date;
	gender: string;
	phone: string;
}

class CreateUserService {
	public async execute({ username, email, password, avatar, birthdate, gender, phone }: Request): Promise<number> {
		// Recebe todos os metodos de repositorio
		//const customRepository = getCustomRepository()
		const userRepository = getRepository(User);


		const created_at = new Date();
		const updated_at = new Date();

		const userData = userRepository.create({
			username,
			email,
			password,
			created_at,
			updated_at,
			avatar,
			birthdate,
			gender,
			phone
		});

		// efetivamente salva o usuario no banco de dados
		await userRepository.save(userData);

		return 1;
	}
}

export default CreateUserService;
