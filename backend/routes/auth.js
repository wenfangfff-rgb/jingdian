const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 登录限流
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 最多5次尝试
  message: { error: '登录尝试次数过多，请15分钟后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 管理员登录
router.post('/login', 
  loginLimiter,
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位')
  ],
  async (req, res) => {
    try {
      // 验证输入
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: '输入验证失败', 
          details: errors.array() 
        });
      }

      const { username, password } = req.body;

      // 验证管理员账号（从环境变量获取）
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (username !== adminUsername) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 在生产环境中，密码应该是加密存储的
      // 这里为了演示简化处理
      if (password !== adminPassword) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 生成JWT令牌
      const token = jwt.sign(
        { 
          id: 'admin',
          username: adminUsername,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: '登录成功',
        token,
        user: {
          id: 'admin',
          username: adminUsername,
          role: 'admin'
        }
      });

    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
);

// 验证令牌
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: '令牌有效',
    user: req.user
  });
});

// 刷新令牌
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    // 生成新的令牌
    const newToken = jwt.sign(
      { 
        id: req.user.id,
        username: req.user.username,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: '令牌刷新成功',
      token: newToken
    });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 登出（客户端处理，服务端记录日志）
router.post('/logout', authenticateToken, (req, res) => {
  console.log(`用户 ${req.user.username} 已登出`);
  res.json({ message: '登出成功' });
});

module.exports = router;