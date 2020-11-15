import { Router } from 'express';
import appointmentsRouter from './users.routes';

const routes = Router();

routes.use('/users', appointmentsRouter);

export default routes;
