import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const instance = axios.create({
  baseURL: baseUrl
});

import type { InternalAxiosRequestConfig } from 'axios';

instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  } else {
    request.headers.delete('Authorization');
  }
  return request;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export default instance;