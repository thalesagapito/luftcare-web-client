import { ProcessEnv } from '~/types/modules';

export default function () {
  const {
    HOST,
    PORT,
    API_URL,
    APOLLO_ENDPOINT,
  } = process.env as ProcessEnv;

  if (!HOST) throw new Error('HOST missing from env');
  if (!PORT) throw new Error('PORT missing from env');
  if (!API_URL) throw new Error('API_URL missing from env');
  if (!APOLLO_ENDPOINT) throw new Error('APOLLO_ENDPOINT missing from env');
}
