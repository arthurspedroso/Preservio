// Mesmos valores do enum UserRole do backend
export type UserRole = 'citizen' | 'admin';

// Contratos espelhados de RegisterCitizenDto, LoginDto e LoginResponseDto do backend
export interface RegisterCitizenInput {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  role: UserRole;
}

// Dados mínimos mantidos na sessão; CPF e telefone ficam fora (minimização, LGPD)
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency?: string;
  registrationNumber?: string;
}
