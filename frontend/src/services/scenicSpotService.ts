import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';

// 景点数据类型
export interface ScenicSpot {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  category: string;
  specifications: {
    name: string;
    price: number;
    description: string;
  }[];
  features: string[];
  openingHours: string;
  contactInfo: string;
  images: string[];
  status: 'active' | 'inactive';
  bookingCount: number;
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

// 景点查询参数
export interface ScenicSpotQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// 景点服务类
export class ScenicSpotService {
  // 获取景点列表
  static async getList(params?: ScenicSpotQuery): Promise<PaginatedResponse<ScenicSpot>> {
    return ApiService.get(API_ENDPOINTS.SCENIC_SPOTS, params);
  }

  // 获取景点详情
  static async getDetail(id: string): Promise<{ data: ScenicSpot }> {
    return ApiService.get(API_ENDPOINTS.SCENIC_SPOT_DETAIL(id));
  }

  // 获取热门景点
  static async getPopular(limit?: number): Promise<{ data: ScenicSpot[] }> {
    return ApiService.get(API_ENDPOINTS.POPULAR_SPOTS, { limit });
  }

  // 创建景点（管理员）
  static async create(data: FormData): Promise<{ message: string; data: ScenicSpot }> {
    return ApiService.upload(API_ENDPOINTS.SCENIC_SPOTS, data);
  }

  // 更新景点（管理员）
  static async update(id: string, data: FormData): Promise<{ message: string; data: ScenicSpot }> {
    return ApiService.upload(`${API_ENDPOINTS.SCENIC_SPOTS}/${id}`, data);
  }

  // 删除景点（管理员）
  static async delete(id: string): Promise<{ message: string }> {
    return ApiService.delete(`${API_ENDPOINTS.SCENIC_SPOTS}/${id}`);
  }
}

export default ScenicSpotService;