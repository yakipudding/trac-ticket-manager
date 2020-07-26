import { AxiosRequestConfig } from 'axios'
export const apiconfig:AxiosRequestConfig = {
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
}