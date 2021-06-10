import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Johnny Brabo',
      email: 'johnnybrabo@gmail.com',
    });

    expect(updatedUser.name).toBe('Johnny Brabo');
    expect(updatedUser.email).toBe('johnnybrabo@gmail.com');
  });

  it('should not be able to update email for an existing one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    await fakeUsersRepository.create({
      name: 'Mojojo',
      email: 'mojojo@gmail.com',
      password: 'gobarber.tests',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Johnny Brabo',
        email: 'mojojo@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Johnny Brabo',
      email: 'johnnybrabo@gmail.com',
      old_password: 'gobarber.tests',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Johnny Brabo',
        email: 'johnnybrabo@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Johnny Bravo',
      email: 'johnnybravo@gmail.com',
      password: 'gobarber.tests',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Johnny Brabo',
        email: 'johnnybrabo@gmail.com',
        old_password: '123',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update if user id not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-id',
        name: 'Johnny Brabo',
        email: 'johnnybrabo@gmail.com',
        old_password: '123',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
