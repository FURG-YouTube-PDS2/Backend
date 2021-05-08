import { Router } from 'express';
var cors = require('cors');
import getImageService from '../services/b642ImageService';
import getAvatarService from '../services/gb642AvatarService';
const imgRouter = Router();

imgRouter.get('/getImage/:id', cors(), async (req, res) => {
	try {
		var id = req.params.id;
		const getImg = new getImageService();
		const img = await getImg.execute({ id });
		var base64Data = img.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
		var actualImg = Buffer.from(base64Data, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': actualImg.length,
		});
		res.end(actualImg);
	} catch (err) {
		console.log(err);
	}
});

imgRouter.get('/getAvatar/:id', cors(), async (req, res) => {
	try {
		var id = req.params.id;
		const getImg = new getAvatarService();
		const img = await getImg.execute({ id });
		var base64Data = img.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
		var actualImg = Buffer.from(base64Data, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': actualImg.length,
		});
		res.end(actualImg);
	} catch (err) {
		console.log(err);
	}
});

export default imgRouter;
