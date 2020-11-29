import { getRepository } from 'typeorm';

import Video from '../models/Video';

interface Request {
	file: File;
	title: string;
	description: string;
}

class SendVideoService {
	public async execute({ file, description, title }: Request): Promise<void> {
		try {
			const file_name = file.name;

			const userRepository = getRepository(Video);

			if (userRepository) {
				await userRepository.save({
					file_name,
					description,
					title
				})
			} else {
				throw new Error("errou");
			}
		} catch {
			throw new Error("carai");
		}

	}
}

export default SendVideoService;
