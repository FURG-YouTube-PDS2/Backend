import { Router } from 'express';

import { getRepository } from 'typeorm';
import Video from '../models/Video';
import User from '../models/User';
import UserVideo from '../models/UserVideo';
import Nintube from '../models/Nintube';

import checkJwt from '../middlewares/checkJwt';
import aws from 'aws-sdk';
//import awsConfig from '../config/aws';
const mediaProxy = Router();

/*const s3 = new aws.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
});*/

//const aws_bucket = awsConfig.bucketName;

mediaProxy.get('/*', async (req, res) => {
	try {
		//get path after /media
		var file = req.params[0];
		var file_type = file.split('/')[0];
		var file_name = file.split('/')[1];
		// consoletype.log();

		// }

		if (file_type == 'nintube') {
			const ninRepository = getRepository(Nintube);

			const data = await ninRepository.findOne({ where: { nickname: file_name } });
			//connect to bucket and get file
			// console.log(data);
			const img = Buffer.from(data!.file, 'base64');

			res.send(img);
			// imgStream.pipe(res);
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}
});

export default mediaProxy;
