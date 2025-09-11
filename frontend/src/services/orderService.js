import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';
// 订单服务类
export class OrderService {
    // 创建订单
    static async create(data) {
        return ApiService.post(API_ENDPOINTS.ORDERS, data);
    }
    // 根据订单号搜索订单
    static async searchByOrderNumber(orderNumber) {
        return ApiService.get(API_ENDPOINTS.ORDER_SEARCH(orderNumber));
    }
    // 获取订单详情
    static async getDetail(id) {
        return ApiService.get(API_ENDPOINTS.ORDER_DETAIL(id));
    }
    // 获取订单列表（管理员）
    static async getList(params) {
        return ApiService.get(API_ENDPOINTS.ORDERS, params);
    }
    // 更新订单状态（管理员）
    static async updateStatus(id, data) {
        return ApiService.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, data);
    }
    // 删除订单（管理员）
    static async delete(id) {
        return ApiService.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
    }
}
export default OrderService;
