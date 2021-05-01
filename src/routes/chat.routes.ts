import { Router } from 'express';
const chatRouter = Router();

chatRouter.get('/chat', (req, res, next) => {
	var io = req.app.get('socketio');
	console.log(io.sockets);

	/*	Message.create(req.body.message)
		.then((message) => {
			// in case the client was disconnected after the request was sent
			// and there's no longer a socket with that id
			if (senderSocket) {
				// use broadcast.emit to message everyone except the original
				// sender of the request !!!
				senderSocket.broadcast.emit('message broadcast', { message });
			}
			res.status(201).json({ message: message.toObject() });
		})
		.catch(next);*/
});

export default chatRouter;
