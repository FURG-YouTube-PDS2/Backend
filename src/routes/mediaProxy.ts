import { Router } from 'express';
import aws from "aws-sdk";
import awsConfig from '../config/aws';

import Video from '../models/Video';
import User from '../models/User';
const mediaProxy = Router();

const s3 = new aws.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
});

const aws_bucket = awsConfig.bucketName;

mediaProxy.get('/*', (req, res) => {
	try {
		//user verification
		if (true){//req.headers.authorization) {
			//const token = req.headers.authorization;
			//get path after /media
			var file = req.params[0];
			var type = file.split("/")[0];
			console.log(file);
			//privacy verification (private) below



			//connect to bucket and get file
			var imgStream = s3.getObject({
				Bucket: aws_bucket,
				Key: file
			}).createReadStream();
			//pipe file to response
			imgStream.pipe(res);
			
		} else {
			throw new Error("Token não recebido.")
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}

});




export default mediaProxy;
