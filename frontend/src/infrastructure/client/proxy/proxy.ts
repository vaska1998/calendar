import type { ClientResponse } from '../response.ts';

export interface ProxyClient {
  post<T, K>(url: string, model: T): Promise<ClientResponse<K>>;

  get<T>(url: string, config?: unknown): Promise<ClientResponse<T>>;

  put<T, K>(url: string, model: T): Promise<ClientResponse<K>>;

  patch<T, K>(url: string, model: T): Promise<ClientResponse<K>>;

  del<T>(url: string): Promise<ClientResponse<T>>;
}
