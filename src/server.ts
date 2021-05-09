import 'reflect-metadata';
import './database';
import routes from './routes';
import cors from 'cors';
import express from 'express';

import ExistVideoService from './services/videos/ExistVideoService';

const app = express();

var bodyParser = require('body-parser');

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(routes);

let server = require('http').Server(app);
let io = require('socket.io')(server, { cors: { origin: '*' } });
const videoService = new ExistVideoService();

io.on('connection', async function (socket: any) {
	const room_id = socket.handshake.query.room_id;
	var username = socket.handshake.query.username;

	//se o vídeo não existe no banco, remove a conexão
	const exists = await videoService.exists({ video_id: room_id });

	if (!exists) {
		io.to(socket.id).emit('err', { message: 'invalid video_id' });
		socket.disconnect();
	}
	socket.join(room_id);

	io.to(room_id).emit('newClient', { username });

	socket.on('message', (data: any) => {
		data.username = username;
		//da um broadcast pra sala
		io.to(room_id).emit('message', data);
	});

	socket.on('changeUsername', (data: any) => {
		username = data.username;
		io.to(room_id).emit('changeUsername', data);
	});

	socket.on('disconnecting', () => {
		//some code
	});

	socket.on('disconnect', () => {
		io.to(room_id).emit('quitClient', { username });
	});
});

// io.on('*', function (socket: any) {
// 	console.log(socket);
// });

let list: Array<string> = ['legal', 'massa'];
const getApiAndEmit = (socket: any) => {
	const response = `resposta ${list[Math.floor(Math.random() * list.length)]}`;

	// Emitting a new message. Will be consumed by the client
	socket.emit('FromAPI', response);
};

server.listen(3334, () => {
	console.log('Server started on port 3334');
});
