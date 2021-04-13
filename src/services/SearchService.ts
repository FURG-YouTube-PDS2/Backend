import { getRepository, getManager } from 'typeorm';

import Video from '../models/Video';
import User from '../models/User';

interface Request {
	input: string;
}

class SearchService {
	public async execute({ input }: Request): Promise<object> {
		try {
			console.log(input);
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);

			const resultVideo = await videoRepository
				.createQueryBuilder('videos')
				.select('videos.description')
				.where('videos.title ~* :searchTerm', { searchTerm: input }) // Colocar um or para descrição
				.getRawMany();

			// Realizar Busca no nomes das tag
			// for na tabela tag_video pra pegar os videos das tags
			// if < 20 videos user_videos

			console.log(resultVideo);
			const resultUser = await getManager()
				.createQueryBuilder(User, 'u')
				.select('u.username')
				.where('u.username ~*:searchTerm', { searchTerm: input })
				.getRawMany();
			console.log(resultUser);
			const result = [resultVideo, resultUser];
			return result;
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default SearchService;
