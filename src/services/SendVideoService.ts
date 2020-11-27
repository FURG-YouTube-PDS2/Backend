import { response } from 'express';

import multer from 'multer';
import { getRepository } from 'typeorm';

import * as aws from 'aws-sdk';
import multerS3 from 'multer-s3';

import Video from '../models/Video';

interface Request {
	file: object;
	file_name: string;
	title?: string;
	description?: string;
}


class SendVideoService {
	public async execute({ file, file_name, description, title }: Request): Promise<void> {
		try {

			// const aws_bucket = "youtube-videos-furg";


			// const s3 = new aws.S3({});
			// aws.config.update({
			// 	accessKeyId: "AKIAWGKRN3ZJ7ILFIIXK",
			// 	secretAccessKey: "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"
			// });
			// const s3 = new aws.S3({
			// 	accessKeyId: "AKIAWGKRN3ZJ7ILFIIXK",
			// 	secretAccessKey: "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"
			// });

			// console.log("cheguei aqui")
			// const upload = multer({
			// 	storage: multerS3({
			// 		s3,
			// 		bucket: aws_bucket,
			// 		acl: 'public-read',
			// 		key: function (request, file, cb) {
			// 			// const id = Math.ceil(Math.random() * 1000000);
			// 			// cb(null, `${id}-${file_name}`)
			// 			cb(null, Date.now().toString())
			// 		},
			// 		metadata: function (req, file, cb) {
			// 			cb(null, { fieldName: file.fieldname });
			// 		}
			// 	}),
			// }).single('file');
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
					file: file_name,
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
