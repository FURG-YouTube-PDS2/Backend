import { Router } from 'express';

import s3Upload from '../middlewares/awsS3Upload';

import sendVideoService from '../services/SendVideoService';

const videosRouter = Router();

//O vídeo é enviado no middleware dentro da requisição
videosRouter.post('/sendFile', s3Upload({}).single('file'), async (req, res) => {

	try {
		const { title, description } = req.body;
		const { file } = req;
		const file_name = file.originalname;

		// file.location para salvar no banco

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
