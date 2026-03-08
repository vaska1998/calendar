import axios, { Axios, AxiosError, type AxiosRequestConfig } from 'axios';
import type { ClientErrorResponse, ClientResponse } from '../response.ts';
import type { ProxyClient } from './proxy.ts';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

const handleError = (error?: AxiosError | unknown): ClientErrorResponse => {
  let axiosError!: AxiosError;
  if (error && (axiosError = error as AxiosError) != null && axiosError.response) {
    const { data, status, statusText } = axiosError.response;
    const { error, message } = data as ErrorResponse;
    return {
      type: 'ERROR',
      status,
      statusText,
      error,
      errorMessage: message,
    };
  }

  return {
    type: 'ERROR',
    errorMessage: 'Undefined error',
    status: -1,
    error: '',
    statusText: '',
  };
};

export class AxiosProxy implements ProxyClient {
  client!: Axios;

  private onUnauthorized: (() => Promise<string | null>) | null = null;

  constructor(baseUrl: string, jwtToken: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
      withCredentials: true,
    });
  }

  setOnUnauthorized(handler: () => Promise<string | null>) {
    this.onUnauthorized = handler;

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry && this.onUnauthorized) {
          originalRequest._retry = true;
          const newToken = await this.onUnauthorized();
          if (newToken && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return this.client.request(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  async post<T, K>(url: string, content: T): Promise<ClientResponse<K>> {
    try {
      const { data, status, statusText } = await this.client.post(url, content);
      return {
        type: 'SUCCESS',
        status,
        statusText,
        result: data,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ClientResponse<T>> {
    try {
      const { data, status, statusText } = await this.client.get(url, config);
      return {
        type: 'SUCCESS',
        status,
        statusText,
        result: data as T,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async put<T, K>(url: string, content: T): Promise<ClientResponse<K>> {
    try {
      const { data, status, statusText } = await this.client.put(url, content);
      return {
        type: 'SUCCESS',
        status,
        statusText,
        result: data,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async patch<T, K>(url: string, content: T): Promise<ClientResponse<K>> {
    try {
      const { data, status, statusText } = await this.client.patch(url, content);
      return {
        type: 'SUCCESS',
        status,
        statusText,
        result: data,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async del<T = undefined>(url: string): Promise<ClientResponse<T>> {
    try {
      const { data, status, statusText } = await this.client.delete(url);
      return {
        type: 'SUCCESS',
        status,
        statusText,
        result: data,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
