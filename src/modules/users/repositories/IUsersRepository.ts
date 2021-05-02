import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByUserId(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}

export default IUsersRepository;
