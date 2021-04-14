import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import videosRouter from './videos.routes';
import nintubeRouter from './nintube.routes';
import emailRouter from './confirms.routes';
import homeRouter from './home.routes';
import commentsRouter from './comments.routes';
import mediaProxy from './mediaProxy';
import playlistRouter from './playlist.routes';
import channelRouter from './channel.routes';
import notificationRouter from './notification.routes';
import recommendedRouter from './recommended.routes';
import searchRouter from './search.routes';

const routes = Router();

routes.get('/ping', (req, res) => {
	res.send('pong');
});
routes.use('/users', usersRouter);
routes.use('/signin', sessionsRouter);
routes.use('/videos', videosRouter);
routes.use('/home', homeRouter);
routes.use('/playlist', playlistRouter);
routes.use('/email', emailRouter);
routes.use('/nin', nintubeRouter);
routes.use('/media', mediaProxy);
routes.use('/comment', commentsRouter);
routes.use('/channel', channelRouter);
routes.use('/notification', notificationRouter);
routes.use('/recommended', recommendedRouter);
routes.use('/search', searchRouter);

export default routes;
