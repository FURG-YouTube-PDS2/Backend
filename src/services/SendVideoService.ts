import { response } from 'express';

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
	public async execute({ file_location, description, title }: Request): Promise<void> {
		try {

			// try {
			// 	await upload(req, {}, (err: any) => {
			// 		console.log('error', err);
			// 	});
			// } catch (err) {
			// 	console.log(err);
			// }


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
			} else {
				throw new Error("errou");
			}
		} catch {
			throw new Error("carai");
		}

	}
}

export default SendVideoService;
