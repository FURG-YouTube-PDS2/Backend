import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DelivererController from './app/controllers/DelivererController';
import OrderController from './app/controllers/OrderController';

// Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// Rotas abaixo executadas apenas se usuário estiver autenticado

routes.put('/users', UserController.update);
routes.post('/recipients', RecipientController.store);
routes.post('/deliverers', DelivererController.store);

routes.put('/deliverers/:id', DelivererController.update);

routes.get('/orders/', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put(
  '/orders/:id',
  upload.single('signatureImg'),
  OrderController.update
);
routes.delete('/orders/:id', OrderController.delete);

export default routes;
