import { getRepository } from 'typeorm';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';


interface Request {
	video_name: string;
	channel_id: string;
}

class RecVideosService {
	public async execute({ video_name, channel_id }: Request): Promise<object> {
	const userVideoRepo = getRepository(UserVideo);
	const videoRepo = getRepository(Video);
	const user_id = channel_id;

	var data = userVideoRepo.find({
		select: ['video_id'],
		where: { user_id: user_id }
	});

	var resolvedData = await data;
	var newData = Array();

	// pega 10 videos do mesmo canal do sendo assistido
	// e recomenda. no futuro, fazer jogo com o video_name para pegar
	// videos de assuntos similares.
	for (let index = 0; index < 10; index++) {
		if (resolvedData[index] === undefined){
			continue;
		}

		newData.push(
			await videoRepo.find({
				select: ['id', 'title', 'thumb'],
				where: { id: resolvedData[index].video_id, privacy: false },
			}),
		);
	}
	var videos_list = newData;
		return videos_list;
	}
}

export default RecVideosService;
