const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const ScenicSpot = require('../models/ScenicSpot');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 创建订单（公开接口）
router.post('/',
  [
    body('scenicSpotId').notEmpty().withMessage('景点ID不能为空'),
    body('specification').notEmpty().withMessage('规格不能为空'),
    body('quantity').isInt({ min: 1 }).withMessage('数量必须是正整数'),
    body('visitDate').isISO8601().withMessage('游览日期格式不正确'),
    body('customerInfo.name').notEmpty().withMessage('姓名不能为空'),
    body('customerInfo.phone').isMobilePhone('zh-CN').withMessage('手机号格式不正确'),
    body('customerInfo.email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('customerInfo.idCard').optional().isLength({ min: 15, max: 18 }).withMessage('身份证号格式不正确')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: '输入验证失败', 
          details: errors.array() 
        });
      }

      const { scenicSpotId, specification, quantity, visitDate, customerInfo, remarks } = req.body;

      // 验证景点是否存在
      const scenicSpot = ScenicSpot.getById(scenicSpotId);
      if (!scenicSpot) {
        return res.status(404).json({ error: '景点不存在' });
      }

      // 验证规格是否存在
      const selectedSpec = scenicSpot.specifications.find(spec => spec.name === specification);
      if (!selectedSpec) {
        return res.status(400).json({ error: '选择的规格不存在' });
      }

      // 计算总金额
      const unitPrice = selectedSpec.price || scenicSpot.price;
      const totalAmount = unitPrice * quantity;

      // 创建订单数据
      const orderData = {
        scenicSpotId,
        scenicSpotName: scenicSpot.name,
        specification,
        quantity,
        unitPrice,
        totalAmount,
        visitDate,
        customerInfo,
        remarks: remarks || '',
        paymentStatus: 'pending' // pending, paid, refunded
      };

      const newOrder = Order.create(orderData);
      if (newOrder) {
        // 更新景点预订数量
        const updatedBookingCount = (scenicSpot.bookingCount || 0) + quantity;
        ScenicSpot.update(scenicSpotId, { bookingCount: updatedBookingCount });

        res.status(201).json({ 
          message: '订单创建成功', 
          data: newOrder 
        });
      } else {
        res.status(500).json({ error: '创建订单失败' });
      }
    } catch (error) {
      console.error('创建订单错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 根据订单号查询订单（公开接口）
router.get('/search/:orderNumber', (req, res) => {
  try {
    const order = Order.getByOrderNumber(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    res.json({ data: order });
  } catch (error) {
    console.error('查询订单错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取订单列表（需要管理员权限）
router.get('/',
  authenticateToken,
  requireAdmin,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
    query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('状态值无效'),
    query('search').optional().isLength({ max: 100 }).withMessage('搜索关键词不能超过100字符')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: '参数验证失败', 
          details: errors.array() 
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        search: req.query.search
      };

      const result = Order.getAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error('获取订单列表错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 获取订单详情（需要管理员权限）
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const order = Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    res.json({ data: order });
  } catch (error) {
    console.error('获取订单详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新订单状态（需要管理员权限）
router.patch('/:id/status',
  authenticateToken,
  requireAdmin,
  [
    body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('状态值无效'),
    body('remarks').optional().isLength({ max: 500 }).withMessage('备注不能超过500字符')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: '输入验证失败', 
          details: errors.array() 
        });
      }

      const { status, remarks } = req.body;
      const existingOrder = Order.getById(req.params.id);
      
      if (!existingOrder) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const updateData = { status };
      if (remarks !== undefined) {
        updateData.adminRemarks = remarks;
      }

      const updatedOrder = Order.update(req.params.id, updateData);
      if (updatedOrder) {
        res.json({ 
          message: '订单状态更新成功', 
          data: updatedOrder 
        });
      } else {
        res.status(500).json({ error: '更新订单状态失败' });
      }
    } catch (error) {
      console.error('更新订单状态错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 更新支付状态（需要管理员权限）
router.patch('/:id/payment',
  authenticateToken,
  requireAdmin,
  [
    body('paymentStatus').isIn(['pending', 'paid', 'refunded']).withMessage('支付状态值无效'),
    body('paymentMethod').optional().notEmpty().withMessage('支付方式不能为空'),
    body('transactionId').optional().notEmpty().withMessage('交易ID不能为空')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: '输入验证失败', 
          details: errors.array() 
        });
      }

      const { paymentStatus, paymentMethod, transactionId } = req.body;
      const existingOrder = Order.getById(req.params.id);
      
      if (!existingOrder) {
        return res.status(404).json({ error: '订单不存在' });
      }

      const updateData = { paymentStatus };
      if (paymentMethod) updateData.paymentMethod = paymentMethod;
      if (transactionId) updateData.transactionId = transactionId;
      if (paymentStatus === 'paid') {
        updateData.paidAt = new Date().toISOString();
      }

      const updatedOrder = Order.update(req.params.id, updateData);
      if (updatedOrder) {
        res.json({ 
          message: '支付状态更新成功', 
          data: updatedOrder 
        });
      } else {
        res.status(500).json({ error: '更新支付状态失败' });
      }
    } catch (error) {
      console.error('更新支付状态错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 删除订单（需要管理员权限）
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existingOrder = Order.getById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ error: '订单不存在' });
    }

    const success = Order.delete(req.params.id);
    if (success) {
      res.json({ message: '订单删除成功' });
    } else {
      res.status(500).json({ error: '删除订单失败' });
    }
  } catch (error) {
    console.error('删除订单错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;