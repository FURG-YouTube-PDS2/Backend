import User from '../../models/User';
import Nintube from '../../models/Nintube';
import { getRepository } from 'typeorm';

//import s3Upload from '../../middlewares/awsS3Upload';

interface Request {
	username: string;
	email: string;
	password: string;
	birthdate: Date;
	gender: string;
	phone: string;
	avatar: string;
}

class CreateUserService {
	public async execute({
		username,
		email,
		password,
		birthdate,
		avatar,
		gender,
		phone,
	}: Request): Promise<string> {
		// Recebe todos os metodos de repositorio
		//const customRepository = getCustomRepository()
		const userRepository = getRepository(User);
		const ninRepository = getRepository(Nintube);
		if (!avatar || avatar === '') {
			const defAva = await ninRepository.findOne({
				where: { nickname: 'default' },
				select: ['file'],
			});
			if (defAva?.file) {
				avatar = defAva?.file;
			}
		}
		const created_at = new Date();
		const updated_at = new Date();
		const exist = await userRepository.findOne({
			where: { email },
		});
		if (!exist) {
			const userData = userRepository.create({
				username,
				email,
				password,
				created_at,
				updated_at,
				avatar,
				birthdate,
				gender,
				phone,
				verified: false,
			});

			// efetivamente salva o usuario no banco de dados
			await userRepository.save(userData);

			const user = await userRepository.findOne({ where: { email } });

			return user!.id;
		} else {
			throw new Error('1');
		}
	}
}

export default CreateUserService;
