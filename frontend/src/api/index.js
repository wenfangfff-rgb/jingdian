import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 添加请求拦截器，用于处理认证令牌
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// 景点相关API
export const scenicApi = {
    // 获取所有景点
    getAll: async (page = 1, limit = 10) => {
        const response = await api.get(`/scenic?page=${page}&limit=${limit}`);
        return response.data;
    },
    // 获取单个景点详情
    getById: async (id) => {
        const response = await api.get(`/scenic/${id}`);
        return response.data;
    },
    // 创建新景点
    create: async (data) => {
        const response = await api.post('/scenic', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    // 更新景点信息
    update: async (id, data) => {
        const response = await api.put(`/scenic/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    // 删除景点
    delete: async (id) => {
        await api.delete(`/scenic/${id}`);
    },
};
// 景点规格相关API
export const specApi = {
    // 获取景点的所有规格
    getByScenicId: async (scenicId) => {
        const response = await api.get(`/specs?scenicId=${scenicId}`);
        return response.data;
    },
    // 创建新规格
    create: async (data) => {
        const response = await api.post('/specs', data);
        return response.data;
    },
    // 更新规格信息
    update: async (id, data) => {
        const response = await api.put(`/specs/${id}`, data);
        return response.data;
    },
    // 删除规格
    delete: async (id) => {
        await api.delete(`/specs/${id}`);
    },
};
// 订单相关API
export const orderApi = {
    // 获取所有订单
    getAll: async (page = 1, limit = 10, filters = {}) => {
        const baseParams = { page: page.toString(), limit: limit.toString() };
        const filteredEntries = Object.entries(filters).filter(([_, v]) => v != null && v !== '');
        const stringEntries = filteredEntries.map(([k, v]) => [k, String(v)]);
        const params = new URLSearchParams({ ...baseParams, ...Object.fromEntries(stringEntries) });
        const response = await api.get(`/orders?${params}`);
        return response.data;
    },
    // 获取单个订单详情
    getById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    // 创建新订单
    create: async (data) => {
        const response = await api.post('/orders', data);
        return response.data;
    },
    // 更新订单状态
    updateStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}`, { status });
        return response.data;
    },
    // 删除订单
    delete: async (id) => {
        await api.delete(`/orders/${id}`);
    },
    // 导出订单
    exportOrders: async (filters = {}) => {
        const filteredEntries = Object.entries(filters).filter(([_, v]) => v != null && v !== '');
        const stringEntries = filteredEntries.map(([k, v]) => [k, String(v)]);
        const params = new URLSearchParams(Object.fromEntries(stringEntries));
        const response = await api.get(`/orders/export?${params}`, {
            responseType: 'blob'
        });
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
// 认证相关API
export const authApi = {
    // 管理员登录
    login: async (username, password) => {
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
