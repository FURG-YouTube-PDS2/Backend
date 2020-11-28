import e, { response } from 'express';

import multer from 'multer';
import { getRepository } from 'typeorm';

import * as aws from 'aws-sdk';
import multerS3 from 'multer-s3';

import Video from '../models/Video';

interface Request {
	file_location: string;
	title: string;
	description?: string;
}


class SendVideoService {
	public async execute({ file_location, description, title }: Request): Promise<number> {
		try {

			const videoRepository = getRepository(Video);
			const created_at = new Date();

			// Add entrada no banco de dados
			if (videoRepository) {
				await videoRepository.save({
					file: file_location,
					description,
					title,
					created_at
				})
				return 1;
			} else {
				throw new Error("Erro ao resgatar repositório de vídeo.");
			}
		} catch (err) {
			throw new Error(err);
		}

	}
}

export default SendVideoService;
