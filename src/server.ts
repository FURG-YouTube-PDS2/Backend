import 'reflect-metadata';
import './database';
import routes from './routes';
import cors from 'cors';
import express from 'express';

const app = express();

var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(routes);

let server = require('http').Server(app);
let io = require('socket.io')(server, { cors: { origin: '*' } });

let interval: any;

io.on('connection', function (socket: any) {
	console.log('tee');
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 1000);
	socket.on('disconnect', () => {
		console.log('Client disconnected');
		clearInterval(interval);
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
