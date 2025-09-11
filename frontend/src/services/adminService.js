import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';
// 管理员服务类
export class AdminService {
    // 获取仪表盘统计数据
    static async getDashboardStats() {
        return ApiService.get(API_ENDPOINTS.ADMIN_DASHBOARD);
    }
    // 获取订单趋势数据
    static async getOrderTrends(days = 30) {
        return ApiService.get(API_ENDPOINTS.ADMIN_ORDER_TRENDS, { days });
    }
    // 获取景点分类统计
    static async getCategoryStats() {
        return ApiService.get(API_ENDPOINTS.ADMIN_CATEGORY_STATS);
    }
    // 导出订单数据
    static async exportOrders(params) {
        const queryParams = new URLSearchParams();
        if (params?.startDate)
            queryParams.append('startDate', params.startDate);
        if (params?.endDate)
            queryParams.append('endDate', params.endDate);
        if (params?.status)
            queryParams.append('status', params.status);
        if (params?.paymentStatus)
            queryParams.append('paymentStatus', params.paymentStatus);
        const url = `${API_ENDPOINTS.ADMIN_EXPORT_ORDERS}?${queryParams.toString()}`;
        const filename = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
        return ApiService.download(url, filename);
    }
    // 导出景点数据
    static async exportScenicSpots(params) {
        const queryParams = new URLSearchParams();
        if (params?.category)
            queryParams.append('category', params.category);
        if (params?.status)
            queryParams.append('status', params.status);
        const url = `${API_ENDPOINTS.ADMIN_EXPORT_SPOTS}?${queryParams.toString()}`;
        const filename = `scenic_spots_${new Date().toISOString().split('T')[0]}.xlsx`;
        return ApiService.download(url, filename);
    }
    // 获取系统信息
    static async getSystemInfo() {
        return ApiService.get('/admin/system/info');
    }
    // 清理过期数据
    static async cleanupExpiredData(days = 30) {
        return ApiService.post('/admin/system/cleanup', { days });
    }
}
export default AdminService;
