const express = require('express');
const Order = require('../models/Order');
const ScenicSpot = require('../models/ScenicSpot');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 获取仪表盘统计数据
router.get('/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    // 获取订单统计
    const orderStats = Order.getStats();
    
    // 获取景点统计
    const allSpots = ScenicSpot.readData();
    const spotStats = {
      total: allSpots.length,
      active: allSpots.filter(spot => spot.status === 'active').length,
      inactive: allSpots.filter(spot => spot.status === 'inactive').length
    };

    // 获取最近订单
    const recentOrders = Order.getAll(1, 5).data;

    // 获取热门景点
    const popularSpots = ScenicSpot.getPopular(5);

    // 计算月度收入趋势（简化版）
    const orders = Order.readData();
    const monthlyRevenue = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = 0;
    }

    orders.forEach(order => {
      if (order.status === 'completed' && order.paidAt) {
        const orderDate = new Date(order.paidAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyRevenue.hasOwnProperty(monthKey)) {
          monthlyRevenue[monthKey] += order.totalAmount || 0;
        }
      }
    });

    res.json({
      orderStats,
      spotStats,
      recentOrders,
      popularSpots,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      }))
    });
  } catch (error) {
    console.error('获取仪表盘统计错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取订单趋势数据
router.get('/dashboard/order-trends', authenticateToken, requireAdmin, (req, res) => {
  try {
    const orders = Order.readData();
    const days = parseInt(req.query.days) || 30;
    const trends = {};
    
    // 初始化最近N天的数据
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      trends[dateKey] = {
        date: dateKey,
        orders: 0,
        revenue: 0
      };
    }

    // 统计每天的订单和收入
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (trends[orderDate]) {
        trends[orderDate].orders += 1;
        if (order.status === 'completed') {
          trends[orderDate].revenue += order.totalAmount || 0;
        }
      }
    });

    res.json({
      trends: Object.values(trends)
    });
  } catch (error) {
    console.error('获取订单趋势错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取景点分类统计
router.get('/dashboard/category-stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const spots = ScenicSpot.readData();
    const categoryStats = {};

    spots.forEach(spot => {
      const category = spot.category || '未分类';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          count: 0,
          bookings: 0
        };
      }
      categoryStats[category].count += 1;
      categoryStats[category].bookings += spot.bookingCount || 0;
    });

    res.json({
      categories: Object.values(categoryStats)
    });
  } catch (error) {
    console.error('获取分类统计错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 导出订单数据
router.get('/export/orders', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const filters = {};
    
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (status) filters.status = status;

    const result = Order.getAll(1, 10000, filters); // 获取所有符合条件的订单
    const orders = result.data;

    // 转换为CSV格式
    const csvHeaders = [
      '订单号', '景点名称', '规格', '数量', '单价', '总金额',
      '游览日期', '客户姓名', '客户电话', '订单状态', '支付状态',
      '创建时间', '备注'
    ];

    const csvRows = orders.map(order => [
      order.orderNumber,
      order.scenicSpotName,
      order.specification,
      order.quantity,
      order.unitPrice,
      order.totalAmount,
      order.visitDate,
      order.customerInfo.name,
      order.customerInfo.phone,
      order.status,
      order.paymentStatus,
      order.createdAt,
      order.remarks || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="orders_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send('\uFEFF' + csvContent); // 添加BOM以支持中文
  } catch (error) {
    console.error('导出订单错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 导出景点数据
router.get('/export/spots', authenticateToken, requireAdmin, (req, res) => {
  try {
    const spots = ScenicSpot.readData();

    // 转换为CSV格式
    const csvHeaders = [
      'ID', '景点名称', '描述', '位置', '价格', '分类',
      '预订数量', '状态', '创建时间', '更新时间'
    ];

    const csvRows = spots.map(spot => [
      spot.id,
      spot.name,
      spot.description.replace(/\n/g, ' '), // 移除换行符
      spot.location,
      spot.price,
      spot.category,
      spot.bookingCount || 0,
      spot.status,
      spot.createdAt,
      spot.updatedAt
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="scenic_spots_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send('\uFEFF' + csvContent); // 添加BOM以支持中文
  } catch (error) {
    console.error('导出景点错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 系统信息
router.get('/system/info', authenticateToken, requireAdmin, (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };

    res.json(systemInfo);
  } catch (error) {
    console.error('获取系统信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 清理过期数据（可选功能）
router.post('/maintenance/cleanup', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { days = 90 } = req.body; // 默认清理90天前的数据
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const orders = Order.readData();
    const validOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate > cutoffDate || order.status !== 'cancelled';
    });

    const deletedCount = orders.length - validOrders.length;
    Order.writeData(validOrders);

    res.json({
      message: '数据清理完成',
      deletedOrders: deletedCount,
      remainingOrders: validOrders.length
    });
  } catch (error) {
    console.error('数据清理错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;