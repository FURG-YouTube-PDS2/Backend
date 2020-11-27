import { Router } from 'express';

import * as aws from 'aws-sdk';
import multerS3 from 'multer-s3';

import multer from 'multer';
import s3 from '../config/aws-config';

import sendVideoService from '../services/SendVideoService';

const videosRouter = Router();

//key: (req, file, cb) => cb(null, 'nome')

videosRouter.post('/sendFile', s3({}).single('file'), async (req, res) => {

	try {
		const { title, description } = req.body;
		const { file, files } = req;
		console.log(file);

		const file_name = file.originalname;

		const sendVideo = new sendVideoService();

		//const sent = await sendVideo.execute({ file, file_name, title, description });

		return res.status(200).json({ status: 1 });
	} catch (err) {
		console.log(err)
		throw new Error();
	}

});
videosRouter.post('/sendData', async (req, res) => {

	try {
		const { file, title, description } = req.body;

		const sendVideo = new sendVideoService();


		return res.status(200).json({ status: 1 });
	} catch {
		throw new Error();
	}

});



export default videosRouter;
