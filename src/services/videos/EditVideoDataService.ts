import { getRepository } from 'typeorm';
import uploadWithId from '../../middlewares/awsUpload';

import checkJwt from '../../middlewares/checkJwt';

import UserVideo from '../../models/UserVideo';
import Video from '../../models/Video';
import TagsVideo from '../../models/TagsVideo';

interface Request {
	token: string;
	title: string;
	description?: string;
	file: string;
	privacy: boolean;
	thumb: string;
	video_id: string;
	tags: [];
}

class EditVideoDataService {
	public async execute({
		token,
		description,
		title,
		privacy,
		thumb,
		file,
		video_id,
		tags,
	}: Request): Promise<number> {
		try {
			const videoRepository = getRepository(Video);
			const userVideoRepository = getRepository(UserVideo);
			const tagsVideoRepo = getRepository(TagsVideo);

			const user_id = checkJwt(token).sub;

			const created_at = new Date();

			// Add entrada no banco de dados

			if (videoRepository) {
				if (file === null) {
					if (thumb === null) {
						const video = await videoRepository.save({
							id: video_id,
							description,
							title,
							privacy,
						});
					} else {
						const video = await videoRepository.save({
							id: video_id,
							description,
							title,
							privacy,
							thumb,
						});
					}
				} else if (thumb === null) {
					const video = await videoRepository.save({
						id: video_id,
						file,
						description,
						title,
						privacy,
					});
				} else {
					const video = await videoRepository.save({
						id: video_id,
						file,
						description,
						title,
						privacy,
						thumb,
					});
				}
				for (let i = 0; i < tags.length; i++) {
					await tagsVideoRepo.save({
						video_id,
						tags_id: tags[i],
					});
				}
				return 1;
			} else {
				throw new Error('Erro ao resgatar repositório de vídeo.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default EditVideoDataService;
