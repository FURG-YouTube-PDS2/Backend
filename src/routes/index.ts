import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import videosRouter from './videos.routes';
import nintubeRouter from './nintube.routes';
import emailRouter from './confirms.routes';
import homeRouter from './home.routes';
import mediaProxy from './mediaProxy';

const routes = Router();

routes.get('/ping', (req, res) => {
	res.send('pong');
});
routes.use('/users', usersRouter);
routes.use('/signin', sessionsRouter);
routes.use('/videos', videosRouter);
routes.use('/home', homeRouter);
routes.use('/email', emailRouter);
routes.use('/nin', nintubeRouter);
routes.use('/media', mediaProxy);

export default routes;
