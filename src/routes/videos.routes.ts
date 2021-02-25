import { Router } from 'express';

import { getRepository } from 'typeorm';

import s3Upload from '../middlewares/awsS3Upload';
import SendVideoService from '../services/SendVideoService';
import WatchVideoService from '../services/WatchVideoService';
import CommentCreateService from '../services/CommentService';
import GetCommentService from '../services/GetCommentService';
import ActionVideoService from '../services/ActionVideoService';
import SubscribedService from '../services//SubscribedService';
import GetPlayerService from '../services/GetPlayerService';

import uploadWithId from '../middlewares/awsUpload';
import checkJwt from '../middlewares/checkJwt';

import User from '../models/User';
import EditVideoDataService from '../services/EditVideoDataService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import Video from '../models/Video';
import UserVideo from '../models/UserVideo';
import ListVideoService from '../services/ListVideoService';

const videosRouter = Router();

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// videosRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {
videosRouter.post('/send', async (req, res) => {
	try {
		const { file, title, description, privacy, thumb } = req.body;
		if (req.headers.authorization) {
			const token = req.headers.authorization;

			// O middleware do S3 usa Multer que retorna objeto com infos do vídeo
			console.log(req.body);
			console.log(req.files);
			// const { file } = req;
			const id = checkJwt(token).sub;
			// uploadWithId(file, 'video', id, title, 'mp4');

			// uploadWithId(thumb, 'image', id, title, 'png');
			var sent = null;
			const sendVideo = new SendVideoService();
			try {
				sent = await sendVideo.execute({
					token,
					file,
					title,
					description,
					privacy,
					thumb,
				});
			} catch (e) {
				console.log(e);
			}
			if (sent) {
				return res.status(200).json({ status: 1 });
			}
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}
});

videosRouter.post('/edit', async (req, res) =>{
	try {
		const { title, description, privacy, thumb } = req.body;
		if (req.headers.authorization) {
			const token = req.headers.authorization;

			const id = checkJwt(token).sub;
			var sent = null;
			const editVideoData = new EditVideoDataService();
			try {
				sent = await editVideoData.execute({
					token,
					title,
					description,
					privacy,
					thumb,
				});
			} catch (e) {
				console.log(e);
			}
			if (sent) {
				return res.status(200).json({ status: 1 });
			}
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}
});

// videosRouter.get('/watch', async (req, res) => {
// 	// watch?v=DQMWPDM1P2M&t=20s
// 	try {
// 		const video_id = req.query.v,
// 			video_time = req.query.t;

// 		if (typeof video_id !== 'string') {
// 			throw new Error('id do vídeo deve ser uma string.');
// 		}

// 		if (req.headers.authorization && video_id) {
// 			const [, token] = req.headers.authorization.split(' ');

// 			const watchVideo = new WatchVideoService();

// 			const videoData = await watchVideo.execute({ token, video_id });

// 			res.status(200).json(videoData);
// 		} else {
// 			throw new Error('Token não recebido.');
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

videosRouter.post('/watch', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		var { video_id, token } = req.body;
		if (typeof video_id !== 'string') {
			throw new Error('id do video deve ser uma string.');
		}
		if (video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const watchVideo = new WatchVideoService();

			const videoData = await watchVideo.execute({ token, video_id });

			res.status(200).json(videoData);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/myVideos', ensureAuthenticated, async (req, res) => {
	try{
		var { token } = req.body;
		if (token){
			const myVideos = new ListVideoService();
			const myVideosList = await myVideos.execute({ token });
			return res.status(200).json(myVideosList);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (e){
		console.log(e);
	}
});

videosRouter.post('/get', async (req, res) => {
	try {
		var { video_id } = req.body;
		// console.log(req.body);
		if (typeof video_id !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const player = new GetPlayerService();

			const data = await player.execute({ video_id });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/sendComment', async (req, res) => {
	try {
		var { token, text, video_id, reply_id } = req.body;
		console.log(req.body);
		if (typeof video_id !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (token && video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const Comment = new CommentCreateService();

			const statusSubs = await Comment.execute({ token, text, video_id, reply_id });

			res.status(200).json(statusSubs);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/getComment', async (req, res) => {
	try {
		var { video_id, token } = req.body;
		// console.log(req.body);
		if (typeof video_id !== 'string') {
			throw new Error('id do usuario deve ser uma string.');
		}
		if (video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const Comment = new GetCommentService();

			const data = await Comment.execute({ video_id, token });

			res.status(200).json(data);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

// videosRouter.put('/edit_comment', async (req, res) => {
// 	// watch?v=DQMWPDM1P2M&t=20s
// 	try {
// 		var { token, target_id } = req.body;
// 		if (typeof target_id !== 'string') {
// 			throw new Error('id do usuario deve ser uma string.');
// 		}
// 		if (token && target_id) {
// 			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

// 			const Subs = new SubscriptionService();

// 			const statusSubs = await Subs.execute({ token, target_id });

// 			res.status(200).json(statusSubs);
// 		} else {
// 			throw new Error('Token não recebido.');
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

// videosRouter.put('/delet_comment', async (req, res) => {
// 	// watch?v=DQMWPDM1P2M&t=20s
// 	try {
// 		var { token, target_id } = req.body;
// 		if (typeof target_id !== 'string') {
// 			throw new Error('id do usuario deve ser uma string.');
// 		}
// 		if (token && target_id) {
// 			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

// 			const Subs = new SubscriptionService();

// 			const statusSubs = await Subs.execute({ token, target_id });

// 			res.status(200).json(statusSubs);
// 		} else {
// 			throw new Error('Token não recebido.');
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

export default videosRouter;
