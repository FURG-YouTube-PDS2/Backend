import { Router } from 'express';

import { getRepository } from 'typeorm';
import Video from '../models/Video';
import User from '../models/User';
import UserVideo from '../models/UserVideo';
import checkJwt from '../middlewares/checkJwt';
import aws from 'aws-sdk';
import awsConfig from '../config/aws';
const mediaProxy = Router();

const s3 = new aws.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
});

const aws_bucket = awsConfig.bucketName;

mediaProxy.get('/*', async (req, res) => {
	try {
		//get path after /media
		var file = req.params[0];
		var type = file.split('/')[0];
		console.log(file);

		if (type == 'image') {
			const userRepository = getRepository(User);
			const user = await userRepository.findOne({ where: { avatar: file } });
			if (user) {
				//connect to bucket and get file
				var imgStream = s3
					.getObject({
						Bucket: aws_bucket,
						Key: file,
					})
					.createReadStream();
				//pipe file to response
				imgStream.pipe(res);
			}
		}

		if (type === 'video' && req.headers.authorization) {
			const token = req.headers.authorization;
			var user_id = checkJwt(token).sub;

			//privacy verification (private) below

			const videoRepository = getRepository(Video);
			const video = await videoRepository.findOne({ where: { file } });
			const userVideoRepository = getRepository(UserVideo);
			const userVideo = await userVideoRepository.findOne({
				where: [{ user_id, video_id: video?.id } /* tumb test */],
			});

			if (video && video?.private && userVideo && userVideo?.is_owner) {
				//connect to bucket and get file
				var imgStream = s3
					.getObject({
						Bucket: aws_bucket,
						Key: file,
					})
					.createReadStream();
				//pipe file to response
				imgStream.pipe(res);
			}

			if (video && !video?.private) {
				//connect to bucket and get file
				var imgStream = s3
					.getObject({
						Bucket: aws_bucket,
						Key: file,
					})
					.createReadStream();
				//pipe file to response
				imgStream.pipe(res);
			}
		}

		if (type == 'nintube') {
			//connect to bucket and get file
			var imgStream = s3
				.getObject({
					Bucket: aws_bucket,
					Key: file,
				})
				.createReadStream();
			//pipe file to response
			imgStream.pipe(res);
		}

		//connect to bucket and get file
		var imgStream = s3
			.getObject({
				Bucket: aws_bucket,
				Key: 'nintube/404.png',
			})
			.createReadStream();
		//pipe file to response
		imgStream.pipe(res);
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}
});

export default mediaProxy;
