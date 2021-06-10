// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Gustavo Carvalho',
      email: 'gcrodrigues413@gmail.com',
      password: 'gobarber.tests',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with a email that already exists', async () => {
    await createUser.execute({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    await expect(
      createUser.execute({
        name: 'Johnny Bravo',
        email: 'johnnybravo@gmail.com',
        password: 'gobarber.tests',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
