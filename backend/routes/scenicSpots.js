const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ScenicSpot = require('../models/ScenicSpot');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadMultiple, deleteFile } = require('../middleware/upload');

const router = express.Router();

// 获取景点列表（公开接口）
router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
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
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = ScenicSpot.getAll(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error('获取景点列表错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 获取热门景点（公开接口）
router.get('/popular', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const popularSpots = ScenicSpot.getPopular(limit);
    res.json({ data: popularSpots });
  } catch (error) {
    console.error('获取热门景点错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取单个景点详情（公开接口）
router.get('/:id', (req, res) => {
  try {
    const spot = ScenicSpot.getById(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: '景点不存在' });
    }
    res.json({ data: spot });
  } catch (error) {
    console.error('获取景点详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 创建景点（需要管理员权限）
router.post('/',
  authenticateToken,
  requireAdmin,
  uploadMultiple('images', 10),
  [
    body('name').notEmpty().withMessage('景点名称不能为空'),
    body('description').notEmpty().withMessage('景点描述不能为空'),
    body('location').notEmpty().withMessage('景点位置不能为空'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须是非负数'),
    body('category').notEmpty().withMessage('景点分类不能为空'),
    body('specifications').optional().isArray().withMessage('规格必须是数组')
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

      const spotData = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        price: parseFloat(req.body.price),
        category: req.body.category,
        specifications: req.body.specifications ? JSON.parse(req.body.specifications) : [],
        features: req.body.features ? req.body.features.split(',').map(f => f.trim()) : [],
        openingHours: req.body.openingHours || '',
        contactInfo: req.body.contactInfo || '',
        images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [],
        status: 'active',
        bookingCount: 0
      };

      const newSpot = ScenicSpot.create(spotData);
      if (newSpot) {
        res.status(201).json({ 
          message: '景点创建成功', 
          data: newSpot 
        });
      } else {
        res.status(500).json({ error: '创建景点失败' });
      }
    } catch (error) {
      console.error('创建景点错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 更新景点（需要管理员权限）
router.put('/:id',
  authenticateToken,
  requireAdmin,
  uploadMultiple('images', 10),
  [
    body('name').optional().notEmpty().withMessage('景点名称不能为空'),
    body('description').optional().notEmpty().withMessage('景点描述不能为空'),
    body('location').optional().notEmpty().withMessage('景点位置不能为空'),
    body('price').optional().isFloat({ min: 0 }).withMessage('价格必须是非负数'),
    body('category').optional().notEmpty().withMessage('景点分类不能为空')
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

      const existingSpot = ScenicSpot.getById(req.params.id);
      if (!existingSpot) {
        return res.status(404).json({ error: '景点不存在' });
      }

      const updateData = {};
      
      // 更新基本信息
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.location) updateData.location = req.body.location;
      if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.specifications) updateData.specifications = JSON.parse(req.body.specifications);
      if (req.body.features) updateData.features = req.body.features.split(',').map(f => f.trim());
      if (req.body.openingHours !== undefined) updateData.openingHours = req.body.openingHours;
      if (req.body.contactInfo !== undefined) updateData.contactInfo = req.body.contactInfo;
      if (req.body.status) updateData.status = req.body.status;

      // 处理图片更新
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/${file.filename}`);
        
        // 如果指定了替换模式，删除旧图片
        if (req.body.replaceImages === 'true') {
          existingSpot.images.forEach(imagePath => {
            const filename = imagePath.split('/').pop();
            deleteFile(filename);
          });
          updateData.images = newImages;
        } else {
          // 追加新图片
          updateData.images = [...existingSpot.images, ...newImages];
        }
      }

      const updatedSpot = ScenicSpot.update(req.params.id, updateData);
      if (updatedSpot) {
        res.json({ 
          message: '景点更新成功', 
          data: updatedSpot 
        });
      } else {
        res.status(500).json({ error: '更新景点失败' });
      }
    } catch (error) {
      console.error('更新景点错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 删除景点（需要管理员权限）
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existingSpot = ScenicSpot.getById(req.params.id);
    if (!existingSpot) {
      return res.status(404).json({ error: '景点不存在' });
    }

    // 删除关联的图片文件
    existingSpot.images.forEach(imagePath => {
      const filename = imagePath.split('/').pop();
      deleteFile(filename);
    });

    const success = ScenicSpot.delete(req.params.id);
    if (success) {
      res.json({ message: '景点删除成功' });
    } else {
      res.status(500).json({ error: '删除景点失败' });
    }
  } catch (error) {
    console.error('删除景点错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;