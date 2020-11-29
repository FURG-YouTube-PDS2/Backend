import express from 'express';
import 'reflect-metadata';
import './database';
import routes from './routes';
import "reflect-metadata";
import cors from "cors";


const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

app.listen(3334, () => {
	console.log('Server started on port 3334');
});
