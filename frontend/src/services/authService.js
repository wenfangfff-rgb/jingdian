import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';
// 认证服务类
export class AuthService {
    // 管理员登录
    static async login(data) {
        const response = await ApiService.post(API_ENDPOINTS.AUTH_LOGIN, data);
        // 保存token和用户信息到localStorage
        if (response.token) {
            localStorage.setItem('admin_token', response.token);
            localStorage.setItem('admin_user', JSON.stringify(response.user));
        }
        return response;
    }
    // 验证token
    static async verify() {
        return ApiService.get(API_ENDPOINTS.AUTH_VERIFY);
    }
    // 刷新token
    static async refresh() {
        const response = await ApiService.post(API_ENDPOINTS.AUTH_REFRESH);
        // 更新token
        if (response.token) {
            localStorage.setItem('admin_token', response.token);
        }
        return response;
    }
    // 登出
    static async logout() {
        try {
            const response = await ApiService.post(API_ENDPOINTS.AUTH_LOGOUT);
            return response;
        }
        finally {
            // 无论请求是否成功，都清除本地存储
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        }
    }
    // 获取当前用户信息
    static getCurrentUser() {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            }
            catch {
                return null;
            }
        }
        return null;
    }
    // 获取token
    static getToken() {
        return localStorage.getItem('admin_token');
    }
    // 检查是否已登录
    static isLoggedIn() {
        return !!this.getToken();
    }
    // 清除认证信息
    static clearAuth() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    }
}
export default AuthService;
