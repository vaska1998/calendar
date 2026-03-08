import type { ProxyClient } from './proxy/proxy.ts';

export abstract class _RootClient {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  constructor(public proxy: ProxyClient) {}
}
