// API配置
export const API_BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://your-production-api.com/api'
    : 'http://localhost:3000/api';
// API端点
export const API_ENDPOINTS = {
    // 景点相关
    SCENIC_SPOTS: '/scenic-spots',
    SCENIC_SPOT_DETAIL: (id) => `/scenic-spots/${id}`,
    POPULAR_SPOTS: '/scenic-spots/popular',
    // 订单相关
    ORDERS: '/orders',
    ORDER_SEARCH: (orderNumber) => `/orders/search/${orderNumber}`,
    ORDER_DETAIL: (id) => `/orders/${id}`,
    // 管理员相关
    AUTH_LOGIN: '/auth/login',
    AUTH_VERIFY: '/auth/verify',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_LOGOUT: '/auth/logout',
    // 管理后台
    ADMIN_DASHBOARD: '/admin/dashboard/stats',
    ADMIN_ORDER_TRENDS: '/admin/dashboard/order-trends',
    ADMIN_CATEGORY_STATS: '/admin/dashboard/category-stats',
    ADMIN_EXPORT_ORDERS: '/admin/export/orders',
    ADMIN_EXPORT_SPOTS: '/admin/export/spots',
    // 健康检查
    HEALTH: '/health'
};
// HTTP状态码
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
// 请求配置
export const REQUEST_CONFIG = {
    timeout: 10000, // 10秒超时
    headers: {
        'Content-Type': 'application/json'
    }
};
// 分页配置
export const PAGINATION_CONFIG = {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100]
};
