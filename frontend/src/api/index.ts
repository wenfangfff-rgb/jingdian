import axios from 'axios';
import { ScenicSpot, ScenicSpec, Order, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，用于处理认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 景点相关API
export const scenicApi = {
  // 获取所有景点
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<ScenicSpot>> => {
    const response = await api.get(`/scenic?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // 获取单个景点详情
  getById: async (id: string): Promise<ScenicSpot> => {
    const response = await api.get(`/scenic/${id}`);
    return response.data;
  },
  
  // 创建新景点
  create: async (data: FormData): Promise<ScenicSpot> => {
    const response = await api.post('/scenic', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // 更新景点信息
  update: async (id: string, data: FormData): Promise<ScenicSpot> => {
    const response = await api.put(`/scenic/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // 删除景点
  delete: async (id: string): Promise<void> => {
    await api.delete(`/scenic/${id}`);
  },
};

// 景点规格相关API
export const specApi = {
  // 获取景点的所有规格
  getByScenicId: async (scenicId: string): Promise<ScenicSpec[]> => {
    const response = await api.get(`/specs?scenicId=${scenicId}`);
    return response.data;
  },
  
  // 创建新规格
  create: async (data: Omit<ScenicSpec, '_id' | 'createdAt' | 'updatedAt'>): Promise<ScenicSpec> => {
    const response = await api.post('/specs', data);
    return response.data;
  },
  
  // 更新规格信息
  update: async (id: string, data: Partial<ScenicSpec>): Promise<ScenicSpec> => {
    const response = await api.put(`/specs/${id}`, data);
    return response.data;
  },
  
  // 删除规格
  delete: async (id: string): Promise<void> => {
    await api.delete(`/specs/${id}`);
  },
};

// 订单相关API
export const orderApi = {
  // 获取所有订单
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
    const response = await api.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // 获取单个订单详情
  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  // 创建新订单
  create: async (data: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  // 更新订单状态
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  },
  
  // 删除订单
  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

// 认证相关API
export const authApi = {
  // 管理员登录
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  // 验证当前登录状态
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  
  // 登出
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default {
  scenic: scenicApi,
  spec: specApi,
  order: orderApi,
  auth: authApi,
};