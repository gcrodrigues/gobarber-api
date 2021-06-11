// import AppError from '@shared/errors/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jeferson Gonzales',
      email: 'jefersongonzales@tuamaeaquelaursa.com',
      password: 'gobarber.tests',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Giovana Joestar',
      email: 'giovanajoestar@tuamaeaquelaursa.com',
      password: 'gobarber.tests',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Enzo Mateus',
      email: 'enzomateus@gmail.com',
      password: 'gobarber.tests',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
