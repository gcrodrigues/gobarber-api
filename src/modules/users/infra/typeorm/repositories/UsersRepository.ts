import { getRepository, Not, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      email,
      name,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (except_user_id) {
      return this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    }

    return this.ormRepository.find();
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email } });

    return findUser;
  }

  public async findByUserId(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
