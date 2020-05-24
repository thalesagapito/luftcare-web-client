import { ProcessEnv } from '~/types/modules';

export default function () {
  const { API_URL, CLIENT_URL, ENV } = process.env as ProcessEnv;

  if (!ENV) throw new Error('ENV missing from .env file');
  if (!API_URL) throw new Error('API_URL missing from .env file');
  if (!CLIENT_URL) throw new Error('CLIENT_URL missing from .env file');
}
