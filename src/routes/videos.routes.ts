import { log } from 'console';
import { Router } from 'express';

import s3Upload from '../middlewares/awsS3Upload';

import sendVideoService from '../services/SendVideoService';

const videosRouter = Router();

//O vídeo é enviado no middleware dentro da requisição
videosRouter.post('/sendFile', s3Upload({}).single('file'), async (req, res) => {

	try {
		const { title, description } = req.body;
		// O middleware do S3 usa Multer que retorna objeto com infos do vídeo
		const { file } = req;

		const file_location = (file as any).location;


		const sendVideo = new sendVideoService();

		const sent = await sendVideo.execute({ file_location, title, description });

		if (sent) {
			return res.status(200).json({ status: 1 });
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
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
