import { Citizen } from '../../domain/entities/citizen.entity';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { InvalidCitizenException } from '../../domain/exceptions/domain.exceptions';
import type { CitizenRepository } from '../../domain/repositories/citizen.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { ConflictException } from '../exceptions/application.exceptions';
import type { PasswordHasher } from '../ports/password-hasher.port';
import { RegisterCitizenUseCase } from './register-citizen.use-case';

const VALID_CPF = '529.982.247-25';

function makeSut() {
  const users = {
    findByEmail: jest.fn().mockResolvedValue(null),
  } as unknown as jest.Mocked<UserRepository>;
  const citizens = {
    findByCpf: jest.fn().mockResolvedValue(null),
    createWithUser: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<CitizenRepository>;
  const hasher: PasswordHasher = {
    hash: jest.fn().mockResolvedValue('hashed'),
    compare: jest.fn(),
  };
  const sut = new RegisterCitizenUseCase(users, citizens, hasher);
  return { sut, users, citizens, hasher };
}

const command = { name: 'Maria', email: 'maria@x.dev', password: 'senhaForte123', cpf: VALID_CPF };

describe('RegisterCitizenUseCase', () => {
  it('cria usuário como cidadão e o cidadão ligado a ele, juntos', async () => {
    const { sut, citizens } = makeSut();

    const { user, citizen } = await sut.execute(command);

    expect(user.role).toBe(UserRole.Citizen);
    expect(user.passwordHash).toBe('hashed');
    expect(citizen.userId).toBe(user.id);
    expect(citizen.cpf).toBe('52998224725');
    expect(citizens.createWithUser).toHaveBeenCalledWith(user, citizen);
  });

  it('recusa email já cadastrado', async () => {
    const { sut, users, citizens } = makeSut();
    users.findByEmail.mockResolvedValue({} as User);

    await expect(sut.execute(command)).rejects.toThrow(ConflictException);
    expect(citizens.createWithUser).not.toHaveBeenCalled();
  });

  it('recusa CPF já cadastrado antes de gerar o hash', async () => {
    const { sut, citizens, hasher } = makeSut();
    citizens.findByCpf.mockResolvedValue({} as Citizen);

    await expect(sut.execute(command)).rejects.toThrow('CPF já cadastrado');
    expect(citizens.findByCpf).toHaveBeenCalledWith('52998224725');
    expect(hasher.hash).not.toHaveBeenCalled();
    expect(citizens.createWithUser).not.toHaveBeenCalled();
  });

  it('recusa CPF inválido com erro de domínio', async () => {
    const { sut, citizens } = makeSut();

    await expect(sut.execute({ ...command, cpf: '123.456.789-00' })).rejects.toThrow(
      InvalidCitizenException,
    );
    expect(citizens.createWithUser).not.toHaveBeenCalled();
  });
});
