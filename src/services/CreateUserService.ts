import User from '../models/User';
import { getRepository } from 'typeorm';
import { parseISO } from 'date-fns';

interface Request {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: Date;
}

class CreateUserService {
    public async execute({ first_name, last_name, email, password, created_at }: Request): Promise<User> {
        // Recebe todos os metodos de repositorio
        //const customRepository = getCustomRepository()
        const userRepository = getRepository(User);

        const newCreated_at = parseISO(created_at);

        const userData = userRepository.create({
          first_name,
          last_name,
          email,
          password,
          created_at
        });

        // efetivamente salva o usuario no banco de dados
        await userRepository.save(userData);

        return userData;
    }
}

export default CreateUserService;
