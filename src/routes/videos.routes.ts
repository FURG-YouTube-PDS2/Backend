import { Router } from 'express';

import { getRepository } from 'typeorm';

//import s3Upload from '../middlewares/awsS3Upload';
import SendVideoService from '../services/videos/SendVideoService';
import WatchVideoService from '../services/videos/WatchVideoService';
import DataVideoService from '../services/videos/DataVideoService';
import CommentCreateService from '../services/comment/CommentService';
import LikedService from '../services/getData/LikedService';
import GetCommentService from '../services/comment/GetCommentService';
import ActionVideoService from '../services/videos/ActionVideoService';
import ReportService from '../services/getData/ReportService';
import GetPlayerService from '../services/videos/GetPlayerService';
import ListVideoService from '../services/videos/ListVideoService';
import DeleteVideoService from '../services/videos/DeleteVideoService';
import GetRecommendedService from '../services/recommended/GetRecommendedService';

//import uploadWithId from '../middlewares/awsUpload';
import checkJwt from '../middlewares/checkJwt';

import User from '../models/User';
import EditVideoDataService from '../services/videos/EditVideoDataService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import Video from '../models/Video';
import UserVideo from '../models/UserVideo';

import RecVideosService from '../services/recommended/RecVideosService';
var cors = require('cors');
import getVideoFileService from '../services/videos/b642VideoService';

const videosRouter = Router();

videosRouter.get('/getVideoFile/:id', cors(), async (req, res) => {
	try {
		var id = req.params.id;

		const getVid = new getVideoFileService();
		const vid = await getVid.execute({ id });
		var type = vid.match(/video\/\w+/);
		var base64Data = vid.replace(/^data:video\/\w+;base64,/, '');
		var actualVid = Buffer.from(base64Data, 'base64');
		if (type !== null) {
			res.writeHead(200, {
				'Content-Type': type[0],
				'Transfer-Encoding': 'chunked',
				'Content-Length': actualVid.length,
				'Accept-Ranges': 'bytes',
			});
			res.end(actualVid);
		}
	} catch (err) {
		console.log(err);
	}
});

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// videosRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {
videosRouter.post('/send', async (req, res) => {
	try {
		const { file, title, description, privacy, thumb, tags } = req.body;
		if (req.headers.authorization) {
			const token = req.headers.authorization;

			// O middleware do S3 usa Multer que retorna objeto com infos do vídeo
			// console.log(req.body);
			// console.log(req.files);
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
					tags,
				});
			} catch (e) {
				console.log(e);
			}
			if (sent !== '') {
				return res.status(200).json({ sent });
			}
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		res.status(400).json({ status: 0, errorName: err, errorMessage: err.message });
	}
});

videosRouter.put('/edit', async (req, res) => {
	try {
		const { file, title, description, privacy, thumb, video_id, tags } = req.body;
		if (req.headers.authorization) {
			const token = req.headers.authorization;

			// const id = checkJwt(token).sub;
			var sent = null;
			const editVideoData = new EditVideoDataService();
			try {
				sent = await editVideoData.execute({
					token,
					title,
					file,
					description,
					privacy,
					thumb,
					video_id,
					tags,
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
			throw new Error('Video Id não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/getData', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		var { video_id, token } = req.body;
		if (typeof video_id !== 'string') {
			throw new Error('id do video deve ser uma string.');
		}
		if (video_id) {
			const video = new DataVideoService();

			const videoData = await video.execute({ token, video_id });
			const tag = new GetRecommendedService();

			const status = await tag.execute({});

			res.status(200).json({ videoData, rec: status });
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/myVideos', async (req, res) => {
	try {
		var { token } = req.body;

		if (token) {
			const myVideos = new ListVideoService();
			const myVideosList = await myVideos.execute({ token });
			return res.status(200).json(myVideosList);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (e) {
		console.log(e);
		return res.status(400).json({ status: 0, errorName: e.name, errorMessage: e.message });
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

videosRouter.post('/liked', async (req, res) => {
	try {
		var { token, video_id, liked } = req.body;
		// console.log(req.body);
		if (typeof token !== 'string') {
			throw new Error('id do video deve ser uma string.');
		}
		if (token && video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const sendLiked = new LikedService();

			const statusSubs = await sendLiked.execute({ token, video_id, liked });

			res.status(200).json(statusSubs);
		} else {
			throw new Error('Token não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.put('/report', async (req, res) => {
	try {
		var { token, video_id, report_text, report_option } = req.body;
		if (typeof video_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do video deve ser uma string.');
		}
		if (token && video_id) {
			// const [, token] = req.headers.authorization.split(' '); //tenho q entender isso aki e o if

			const sendReport = new ReportService();

			const statusReport = await sendReport.execute({
				token,
				video_id,
				report_text,
				report_option,
			});

			res.status(200).json(sendReport);
		} else {
			throw new Error('Token ou Id doS video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

videosRouter.post('/recommended', async (req, res) => {
	// para recomendar videos similares ao assitido no momento.
	// logica no service
	try {
		var { video_id } = req.body;

		const recSimilarVideosBuilder = new RecVideosService();
		const recSimilarVideos = await recSimilarVideosBuilder.execute({
			video_id,
		});

		res.status(200).json(recSimilarVideos);
	} catch (error) {
		console.log(error.message);
	}
});

videosRouter.post('/delet', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		var { video_id } = req.body;
		if (typeof video_id !== 'string') {
			throw new Error('id do video deve ser uma string.');
		}
		if (video_id) {
			const delet_video = new DeleteVideoService();

			const status = await delet_video.execute({ video_id });

			res.status(200).json(status);
		} else {
			throw new Error('Id do video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default videosRouter;
