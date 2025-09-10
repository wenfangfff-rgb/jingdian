import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { API_BASE_URL, REQUEST_CONFIG, HTTP_STATUS } from '../config/api';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_CONFIG.timeout,
  headers: REQUEST_CONFIG.headers
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message.error('未授权访问，请重新登录');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/admin/login';
          break;
        case HTTP_STATUS.FORBIDDEN:
          message.error('权限不足');
          break;
        case HTTP_STATUS.NOT_FOUND:
          message.error('请求的资源不存在');
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message.error('服务器内部错误');
          break;
        default:
          message.error(response.data?.error || '请求失败');
      }
    } else {
      message.error('网络连接失败，请检查网络设置');
    }
    
    return Promise.reject(error);
  }
);

// API服务类
export class ApiService {
  // GET请求
  static async get<T = any>(url: string, params?: any): Promise<T> {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST请求
  static async post<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT请求
  static async put<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH请求
  static async patch<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE请求
  static async delete<T = any>(url: string): Promise<T> {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 文件上传
  static async upload<T = any>(url: string, formData: FormData): Promise<T> {
    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 下载文件
  static async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }
}

export default apiClient;