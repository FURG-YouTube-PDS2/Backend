import express from 'express';
import 'reflect-metadata';
import './database';
import routes from './routes';
import 'reflect-metadata';
// import bodyParser from 'body-parser';
import cors from 'cors';

import awsConfig from './config/aws';

const app = express();
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(routes);

app.listen(3334, () => {
	console.log('Server started on port 3334');
});
