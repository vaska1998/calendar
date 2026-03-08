import { _RootClient } from './__root.client.ts';
import type { ProxyClient } from './proxy/proxy.ts';
import type { TaskCreateUpdateDto } from '../dto/task/task.create-update.dto.ts';
import type { ClientResponse } from './response.ts';
import type { Task } from '../dto/task/task.ts';

export class TaskClient extends _RootClient {
  constructor(proxy: ProxyClient) {
    super(proxy);
  }

  getAll(from: string, to: string): Promise<ClientResponse<Task[]>> {
    return this.proxy.get('/task', { params: { from, to } });
  }

  create(content: TaskCreateUpdateDto): Promise<ClientResponse<Task>> {
    return this.proxy.post('/task', content);
  }

  update(id: string, content: Partial<TaskCreateUpdateDto>): Promise<ClientResponse<Task>> {
    return this.proxy.patch(`/task/${id}`, content);
  }

  delete(id: string): Promise<ClientResponse<void>> {
    return this.proxy.del(`/task/${id}`);
  }
}
