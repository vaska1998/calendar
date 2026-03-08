import { _RootClient } from './__root.client.ts';
import type { ProxyClient } from './proxy/proxy.ts';
import type { UserCreateUpdateDto } from '../dto/user/userCreateUpdateDto.ts';
import type { ClientResponse } from './response.ts';
import type { User } from '../dto/user/user.ts';

export class UserClient extends _RootClient {
  constructor(proxy: ProxyClient) {
    super(proxy);
  }

  create(content: UserCreateUpdateDto): Promise<ClientResponse<User>> {
    return this.proxy.post('/user', content);
  }

  update(content: Partial<UserCreateUpdateDto>): Promise<ClientResponse<User>> {
    return this.proxy.post('/user/update', content);
  }

  delete(): Promise<ClientResponse<void>> {
    return this.proxy.del('/user');
  }
}
