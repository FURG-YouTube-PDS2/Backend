import { Router } from 'express';

import { getRepository } from 'typeorm';

import CommentCreateService from '../services/comment/CommentService';
import LikedCommentService from '../services/comment/LikedCommentService';
import GetCommentService from '../services/comment/GetCommentService';
import EditCommentService from '../services/comment/EditCommentService';
import DeleteCommentService from '../services/comment/DeleteCommentService';

import uploadWithId from '../middlewares/awsUpload';
import checkJwt from '../middlewares/checkJwt';

import User from '../models/User';
import EditVideoDataService from '../services/videos/EditVideoDataService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import Video from '../models/Video';
import UserVideo from '../models/UserVideo';

const commentsRouter = Router();

// O vídeo é enviado no middleware dentro da requisição
// Dentro do objeto passado, de passar parametros (aws;ts)
// commentsRouter.post('/send', s3Upload({}).single('file'), async (req, res) => {

commentsRouter.post('/sendComment', async (req, res) => {
	try {
		var { token, text, video_id, reply_id } = req.body;

		if (typeof video_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do video e token deve ser uma string.');
		}
		if (token && video_id) {
			const Comment = new CommentCreateService();

			const statusSubs = await Comment.execute({ token, text, video_id, reply_id });

			res.status(200).json(statusSubs);
		} else {
			throw new Error('Token ou Id do video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

commentsRouter.post('/getComment', async (req, res) => {
	try {
		var { token, video_id, numberSkip } = req.body;
		// console.log(req.body);
		if (typeof video_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do video e token deve ser uma string.');
		}
		if (video_id) {
			const Comment = new GetCommentService();

			const data = await Comment.execute({ token, video_id, numberSkip });

			res.status(200).json(data);
		} else {
			throw new Error('Token ou Id do video não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

commentsRouter.post('/liked', async (req, res) => {
	try {
		var { token, comment_id, liked } = req.body;
		// console.log(req.body);
		if (typeof comment_id !== 'string' || typeof token !== 'string') {
			throw new Error('id do comentario deve ser uma string.');
		}
		if (token && comment_id) {
			const sendLiked = new LikedCommentService();

			const status = await sendLiked.execute({ token, comment_id, liked });

			res.status(200).json(status);
		} else {
			throw new Error('Token ou Id do comentario não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

commentsRouter.put('/edit_comment', async (req, res) => {
	try {
		var { text, comment_id } = req.body;
		// console.log(req.body);
		if (typeof comment_id !== 'string') {
			throw new Error('id do comentario deve ser uma string.');
		}
		if (comment_id) {
			const Comment = new EditCommentService();

			const status = await Comment.execute({ text, comment_id });

			res.status(200).json(status);
		} else {
			throw new Error('Id do comentario não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

commentsRouter.put('/delet_comment', async (req, res) => {
	// watch?v=DQMWPDM1P2M&t=20s
	try {
		var { comment_id } = req.body;
		if (typeof comment_id !== 'string') {
			throw new Error('id do comentario deve ser uma string.');
		}
		if (comment_id) {
			const comment = new DeleteCommentService();

			const status = await comment.execute({ comment_id });

			res.status(200).json(status);
		} else {
			throw new Error('Id do comentario não recebido.');
		}
	} catch (err) {
		console.log(err);
	}
});

export default commentsRouter;
