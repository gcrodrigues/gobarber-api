// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Gustavo Carvalho',
      email: 'gcrodrigues413@gmail.com',
      password: 'gobarber.tests',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with a email that already exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    expect(
      createUserService.execute({
        name: 'Johnny Bravo',
        email: 'johnnybravo@gmail.com',
        password: 'gobarber.tests',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
