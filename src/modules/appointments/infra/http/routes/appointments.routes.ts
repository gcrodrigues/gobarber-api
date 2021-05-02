import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentCtronller from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

const appointmentsController = new AppointmentCtronller();

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
