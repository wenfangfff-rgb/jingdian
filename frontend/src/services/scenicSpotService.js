import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/api';
// 景点服务类
export class ScenicSpotService {
    // 获取景点列表
    static async getList(params) {
        return ApiService.get(API_ENDPOINTS.SCENIC_SPOTS, params);
    }
    // 获取景点详情
    static async getDetail(id) {
        return ApiService.get(API_ENDPOINTS.SCENIC_SPOT_DETAIL(id));
    }
    // 获取热门景点
    static async getPopular(limit) {
        return ApiService.get(API_ENDPOINTS.POPULAR_SPOTS, { limit });
    }
    // 创建景点（管理员）
    static async create(data) {
        return ApiService.upload(API_ENDPOINTS.SCENIC_SPOTS, data);
    }
    // 更新景点（管理员）
    static async update(id, data) {
        return ApiService.upload(`${API_ENDPOINTS.SCENIC_SPOTS}/${id}`, data);
    }
    // 删除景点（管理员）
    static async delete(id) {
        return ApiService.delete(`${API_ENDPOINTS.SCENIC_SPOTS}/${id}`);
    }
}
export default ScenicSpotService;
