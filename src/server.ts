import 'reflect-metadata';
import express from 'express';
import './database';
import routes from './routes';
// import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('socketio', io);

//import awsConfig from './config/aws';

var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(routes);

io.on('connection', (socket) => {
	console.log('A user connected!');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	socket.on('chat message', (msg) => {
		console.log(msg);
	});
});

app.listen(3334, () => {
	console.log('Server started on port 3334');
});
