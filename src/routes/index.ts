import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import videosRouter from './videos.routes';
import emailRouter from './confirms.routes';

const routes = Router();

routes.get('/ping', (req, res) => {
	res.send('pong');
});
routes.use('/users', usersRouter);
routes.use('/signin', sessionsRouter);
routes.use('/videos', videosRouter);
routes.use('/email', emailRouter);

export default routes;

