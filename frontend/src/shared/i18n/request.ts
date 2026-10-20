import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, defaultTimeZone } from './config';

export default getRequestConfig(async () => ({
  locale: defaultLocale,
  timeZone: defaultTimeZone,
  messages: (await import(`../../../messages/${defaultLocale}.json`)).default,
}));
