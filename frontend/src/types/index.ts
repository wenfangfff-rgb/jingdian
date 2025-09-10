// 景点信息类型
export interface ScenicSpot {
  _id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// 景点规格类型
export interface ScenicSpec {
  _id: string;
  scenicId: string;
  name: string; // 例如：成人票、儿童票、含餐票等
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 订单信息类型
export interface Order {
  _id: string;
  scenicId: string;
  scenicName: string;
  specId: string;
  specName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 用户信息类型
export interface User {
  _id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}