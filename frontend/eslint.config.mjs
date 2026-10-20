import nextConfig from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

const config = [{ ignores: ['.next/', 'next-env.d.ts'] }, ...nextConfig, prettier];

export default config;
