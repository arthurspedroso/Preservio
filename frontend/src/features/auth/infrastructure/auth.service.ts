import { ApiError } from '@/shared/infrastructure/http-client';
import {
  generateId,
  hashSecret,
  readCollection,
  simulateLatency,
  writeCollection,
} from '@/shared/infrastructure/mock-db';
import { onlyDigits } from '@/shared/lib/masks';
import type {
  LoginInput,
  LoginResponse,
  RegisterCitizenInput,
  SessionUser,
  UserRole,
} from '../domain/types';

// Simula os endpoints POST /citizens, POST /auth/login e GET /auth/me do backend

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  salt: string;
  passwordHash: string;
  cpf: string | null;
  phone: string | null;
  agency?: string;
  registrationNumber?: string;
  createdAt: string;
}

// 409 do cadastro, com o campo em conflito para o formulário destacar
export class ConflictError extends ApiError {
  constructor(
    message: string,
    public readonly field: 'email' | 'cpf',
  ) {
    super(message, 409);
  }
}

const COLLECTION = 'users';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

// Contas de demonstração. A conta administrativa não é criada pelo cadastro público
// (regra de negócio 2): no sistema real ela seria provisionada pelo órgão.
export const DEMO_ACCOUNTS = {
  citizen: { email: 'maria@preservio.dev', password: 'Cidadao123' },
  admin: { email: 'orgao@preservio.dev', password: 'Orgao1234' },
} as const;

async function seedUsers(): Promise<StoredUser[]> {
  const make = async (
    user: Omit<StoredUser, 'id' | 'salt' | 'passwordHash' | 'createdAt'>,
    password: string,
    id: string,
  ): Promise<StoredUser> => {
    const salt = generateId();
    return {
      ...user,
      id,
      salt,
      passwordHash: await hashSecret(`${salt}:${password}`),
      createdAt: '2026-10-01T12:00:00.000Z',
    };
  };

  return Promise.all([
    make(
      {
        name: 'Maria Souza',
        email: DEMO_ACCOUNTS.citizen.email,
        role: 'citizen',
        cpf: '52998224725',
        phone: '11987654321',
      },
      DEMO_ACCOUNTS.citizen.password,
      'demo-citizen-maria',
    ),
    make(
      {
        name: 'Carlos Menezes',
        email: DEMO_ACCOUNTS.admin.email,
        role: 'admin',
        cpf: null,
        phone: null,
        agency: 'Secretaria Municipal de Meio Ambiente (simulada)',
        registrationNumber: 'SMMA-0427',
      },
      DEMO_ACCOUNTS.admin.password,
      'demo-admin-carlos',
    ),
  ]);
}

async function getUsers(): Promise<StoredUser[]> {
  const stored = readCollection<StoredUser>(COLLECTION);
  if (stored) return stored;
  const seeded = await seedUsers();
  writeCollection(COLLECTION, seeded);
  return seeded;
}

// Token opaco no formato "mock.<payload base64>", validado a cada chamada como o JWT do backend
function issueToken(user: StoredUser): string {
  const payload = { sub: user.id, role: user.role, exp: Date.now() + TOKEN_TTL_MS };
  return `mock.${btoa(JSON.stringify(payload))}`;
}

// Usado pelos demais serviços simulados para autorizar cada operação, como o guard JWT do backend
export function readToken(token: string): { sub: string; role: UserRole } {
  try {
    const payload = JSON.parse(atob(token.replace(/^mock\./, '')));
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) throw new Error();
    return payload;
  } catch {
    throw new ApiError('Sessão expirada. Entre novamente.', 401);
  }
}

const toSessionUser = ({ id, name, email, role, agency, registrationNumber }: StoredUser) => ({
  id,
  name,
  email,
  role,
  agency,
  registrationNumber,
});

export const authService = {
  async registerCitizen(input: RegisterCitizenInput): Promise<SessionUser> {
    await simulateLatency(700);
    const users = await getUsers();
    const email = input.email.trim().toLowerCase();
    const cpf = onlyDigits(input.cpf);

    if (users.some((u) => u.email === email)) {
      throw new ConflictError('Este e-mail já está cadastrado.', 'email');
    }
    if (users.some((u) => u.cpf === cpf)) {
      throw new ConflictError('Este CPF já está cadastrado.', 'cpf');
    }

    const salt = generateId();
    const user: StoredUser = {
      id: generateId(),
      name: input.name.trim(),
      email,
      role: 'citizen',
      salt,
      passwordHash: await hashSecret(`${salt}:${input.password}`),
      cpf,
      phone: input.phone ? onlyDigits(input.phone) || null : null,
      createdAt: new Date().toISOString(),
    };
    writeCollection(COLLECTION, [...users, user]);
    return toSessionUser(user);
  },

  async login(input: LoginInput): Promise<LoginResponse> {
    await simulateLatency();
    const users = await getUsers();
    const user = users.find((u) => u.email === input.email.trim().toLowerCase());
    const hash = user ? await hashSecret(`${user.salt}:${input.password}`) : null;

    // Mesma mensagem para e-mail inexistente e senha errada, para não revelar contas
    if (!user || hash !== user.passwordHash) {
      throw new ApiError('E-mail ou senha incorretos.', 401);
    }
    return { accessToken: issueToken(user), role: user.role };
  },

  async me(token: string): Promise<SessionUser> {
    const { sub } = readToken(token);
    const user = (await getUsers()).find((u) => u.id === sub);
    if (!user) throw new ApiError('Sessão expirada. Entre novamente.', 401);
    return toSessionUser(user);
  },
};
