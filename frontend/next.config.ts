import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Esconde o indicador "N" do Next em desenvolvimento (não aparece no build de produção)
  devIndicators: false,
};

export default withNextIntl(nextConfig);
