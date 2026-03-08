import { _RootClient } from './__root.client.ts';
import type { ProxyClient } from './proxy/proxy.ts';
import type { NagerDateRequestDto } from '../dto/nager-date/nager-date.request.dto.ts';
import type { ClientResponse } from './response.ts';
import type { Holiday } from '../dto/nager-date/holiday.ts';

export class NagerDateClient extends _RootClient {
  constructor(proxy: ProxyClient) {
    super(proxy);
  }

  getHolidays(content: NagerDateRequestDto): Promise<ClientResponse<Holiday[]>> {
    return this.proxy.post('/nager-date/', content);
  }
}
