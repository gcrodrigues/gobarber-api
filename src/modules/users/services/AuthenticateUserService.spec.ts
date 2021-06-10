// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Gustavo Carvalho',
      email: 'gcrodrigues413@gmail.com',
      password: 'gobarber.tests',
    });

    const response = await authenticateUser.execute({
      email: 'gcrodrigues413@gmail.com',
      password: 'gobarber.tests',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate if email do not exists', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johnnybravo@gmail.com',
        password: 'gobarber.tests',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    await expect(
      authenticateUser.execute({
        email: 'johnnybravo@gmail.com',
        password: 'wrong.password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
