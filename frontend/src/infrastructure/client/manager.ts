import type { ProxyClient } from './proxy/proxy.ts';
import { AuthClient } from './auth.client.ts';
import { TaskClient } from './task.client.ts';
import { NagerDateClient } from './nager-date.client.ts';
import { UserClient } from './user.client.ts';

export type ClientManagerType = {
  auth: AuthClient;
  task: TaskClient;
  nagerDate: NagerDateClient;
  user: UserClient;
};

export const createClientManager = (proxy: ProxyClient): ClientManagerType => ({
  auth: new AuthClient(proxy),
  task: new TaskClient(proxy),
  nagerDate: new NagerDateClient(proxy),
  user: new UserClient(proxy),
});
