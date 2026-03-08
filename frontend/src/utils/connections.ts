import { type AuthCredentialsWithClaims, CREDENTIALS_KEY, parseTokenCredentials } from './token.ts';
import { type ClientManagerType, createClientManager } from '../infrastructure/client/manager.ts';
import { getCookie } from './cookie.ts';
import { AxiosProxy } from '../infrastructure/client/proxy/axios.proxy.ts';

export type ConnectionType = {
  credentials: AuthCredentialsWithClaims | null;
  client: ClientManagerType;
};

interface SimpleRequest {
  headers: {
    cookie?: string;
  };
}

const _metaEnv: any = (import.meta as any).env ?? {};
export const API_URL = _metaEnv.VITE_API_URL ?? _metaEnv.VITE_API_BASE_URL ?? '/api';

export const getConnection = (req?: SimpleRequest): ConnectionType => {
  if (!req && typeof window == 'undefined') {
    throw 'Please, to use connection provide REQ object';
  }

  const fullCookieString = req ? req.headers.cookie : window.document.cookie;
  const credentialsJsonString = getCookie(CREDENTIALS_KEY, fullCookieString || '');
  const credentials = parseTokenCredentials(credentialsJsonString);
  return {
    credentials,
    client: createClientManager(new AxiosProxy(API_URL, credentials?.accessToken ?? '')),
  };
};
