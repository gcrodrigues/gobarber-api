import { Router } from 'express';

import SessionsCotnroller from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsCotnroller();

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
