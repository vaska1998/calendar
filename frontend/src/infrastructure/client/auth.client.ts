import { _RootClient } from './__root.client.ts';
import type { ProxyClient } from './proxy/proxy.ts';
import type {
  AuthLoginSignInRequest,
  AuthRefreshRequest,
  AuthTokenResponse,
} from '../dto/auth/login.ts';
import type { ClientResponse } from './response.ts';

export class AuthClient extends _RootClient {
  constructor(proxy: ProxyClient) {
    super(proxy);
  }

  signIn(content: AuthLoginSignInRequest): Promise<ClientResponse<AuthTokenResponse>> {
    return this.proxy.post('/auth/signin', content);
  }

  refresh(content: AuthRefreshRequest): Promise<ClientResponse<AuthTokenResponse>> {
    return this.proxy.post('/auth/refresh', content);
  }
}
