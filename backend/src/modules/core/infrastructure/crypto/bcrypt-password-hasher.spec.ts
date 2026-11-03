import { BcryptPasswordHasher } from './bcrypt-password-hasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  it('nunca guarda a senha em texto puro', async () => {
    const hash = await hasher.hash('minhaSenha');

    expect(hash).not.toContain('minhaSenha');
    expect(hash).toMatch(/^\$2[aby]\$10\$/);
  });

  it('gera hashes diferentes para a mesma senha (salt)', async () => {
    const [a, b] = await Promise.all([hasher.hash('minhaSenha'), hasher.hash('minhaSenha')]);

    expect(a).not.toBe(b);
  });

  it('compara a senha correta e rejeita a errada', async () => {
    const hash = await hasher.hash('minhaSenha');

    await expect(hasher.compare('minhaSenha', hash)).resolves.toBe(true);
    await expect(hasher.compare('senhaErrada', hash)).resolves.toBe(false);
  });
});
