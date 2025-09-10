const fs = require('fs');
const path = require('path');

class Order {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/orders.json');
    this.ensureDataFile();
  }

  ensureDataFile() {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取订单数据失败:', error);
      return [];
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('写入订单数据失败:', error);
      return false;
    }
  }

  // 获取所有订单
  getAll(page = 1, limit = 10, filters = {}) {
    const orders = this.readData();
    let filteredOrders = orders;

    // 状态过滤
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    // 日期范围过滤
    if (filters.startDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= new Date(filters.endDate)
      );
    }

    // 搜索过滤
    if (filters.search) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerInfo.phone.includes(filters.search) ||
        order.scenicSpotName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // 排序（按创建时间倒序）
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 分页
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      data: paginatedOrders,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 根据ID获取订单
  getById(id) {
    const orders = this.readData();
    return orders.find(order => order.id === id);
  }

  // 根据订单号获取订单
  getByOrderNumber(orderNumber) {
    const orders = this.readData();
    return orders.find(order => order.orderNumber === orderNumber);
  }

  // 创建订单
  create(orderData) {
    const orders = this.readData();
    const orderNumber = this.generateOrderNumber();
    
    const newOrder = {
      id: Date.now().toString(),
      orderNumber,
      ...orderData,
      status: 'pending', // pending, confirmed, cancelled, completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    if (this.writeData(orders)) {
      return newOrder;
    }
    return null;
  }

  // 更新订单
  update(id, updateData) {
    const orders = this.readData();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      return null;
    }

    orders[index] = {
      ...orders[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (this.writeData(orders)) {
      return orders[index];
    }
    return null;
  }

  // 删除订单
  delete(id) {
    const orders = this.readData();
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) {
      return false;
    }

    return this.writeData(filteredOrders);
  }

  // 生成订单号
  generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    
    return `ORD${year}${month}${day}${timestamp}`;
  }

  // 获取统计数据
  getStats() {
    const orders = this.readData();
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const confirmed = orders.filter(order => order.status === 'confirmed').length;
    const completed = orders.filter(order => order.status === 'completed').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue
    };
  }
}

module.exports = new Order();