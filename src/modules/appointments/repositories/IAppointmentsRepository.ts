import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmenteDTO from '../dtos/ICreateAppointmentDTO';

interface IAppointmentsRepository {
  create(data: ICreateAppointmenteDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}

export default IAppointmentsRepository;
