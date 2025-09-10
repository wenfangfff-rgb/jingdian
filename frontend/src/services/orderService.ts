import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';

// 订单数据类型
export interface Order {
  id: string;
  orderNumber: string;
  scenicSpotId: string;
  scenicSpotName: string;
  specification: {
    name: string;
    price: number;
    description: string;
  };
  quantity: number;
  totalAmount: number;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    idCard?: string;
  };
  visitDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 订单查询参数
export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// 创建订单数据
export interface CreateOrderData {
  scenicSpotId: string;
  specificationIndex: number;
  quantity: number;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    idCard?: string;
  };
  visitDate: string;
  notes?: string;
}

// 更新订单状态数据
export interface UpdateOrderStatusData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
}

// 订单服务类
export class OrderService {
  // 创建订单
  static async create(data: CreateOrderData): Promise<{ message: string; data: Order }> {
    return ApiService.post(API_ENDPOINTS.ORDERS, data);
  }

  // 根据订单号搜索订单
  static async searchByOrderNumber(orderNumber: string): Promise<{ data: Order }> {
    return ApiService.get(API_ENDPOINTS.ORDER_SEARCH(orderNumber));
  }

  // 获取订单详情
  static async getDetail(id: string): Promise<{ data: Order }> {
    return ApiService.get(API_ENDPOINTS.ORDER_DETAIL(id));
  }

  // 获取订单列表（管理员）
  static async getList(params?: OrderQuery): Promise<PaginatedResponse<Order>> {
    return ApiService.get(API_ENDPOINTS.ORDERS, params);
  }

  // 更新订单状态（管理员）
  static async updateStatus(id: string, data: UpdateOrderStatusData): Promise<{ message: string; data: Order }> {
    return ApiService.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, data);
  }

  // 删除订单（管理员）
  static async delete(id: string): Promise<{ message: string }> {
    return ApiService.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
  }
}

export default OrderService;