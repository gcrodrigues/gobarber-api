import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 6, 10, 13),
      user_id: '123123',
      provider_id: '12341564',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12341564');
  });

  it('should not be able to create two appointments in the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 1, 10).getTime();
    });
    const appointmentDate = new Date(2021, 6, 6, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123123',
      provider_id: '12341564',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '123123',
        provider_id: '12341564',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 11),
        user_id: '123123',
        provider_id: '12341564',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 11),
        user_id: '123123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 7),
        user_id: '123123',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 18),
        user_id: '123123',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
