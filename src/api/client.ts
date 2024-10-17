import createClient from 'openapi-fetch';
import type { paths } from './schema';
import { getHeaders } from '../types/api';

export const apiClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_REACT_APP_DOMAIN}/`,
  headers: getHeaders(),
});
