import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateCommentService from '../services/CreateCommentService';
import { getCustomRepository } from 'typeorm';

const appointmentsRouter = Router();

// Rota: Receber request ->? chamar outro(s) arquivos -> devolver response.

appointmentsRouter.get('/', async(request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async(request, response) => {
    try {
        const { provider, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider
        });

        return response.json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});


export default appointmentsRouter;
