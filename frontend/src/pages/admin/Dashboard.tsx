import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Button, DatePicker, Select, message } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';
import { AdminService, DashboardStats, OrderTrend, CategoryStats } from '../../services/adminService';
import AdminLayout from '../../components/AdminLayout';
import './Dashboard.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderTrends, setOrderTrends] = useState<OrderTrend[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, trendsRes, categoryRes] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getOrderTrends(30),
        AdminService.getCategoryStats()
      ]);
      
      setStats(statsRes.data);
      setOrderTrends(trendsRes.data);
      setCategoryStats(categoryRes.data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 导出订单数据
  const handleExportOrders = async () => {
    setExportLoading(true);
    try {
      await AdminService.exportOrders();
      message.success('订单数据导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setExportLoading(false);
    }
  };

  // 导出景点数据
  const handleExportSpots = async () => {
    setExportLoading(true);
    try {
      await AdminService.exportScenicSpots();
      message.success('景点数据导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setExportLoading(false);
    }
  };

  // 订单趋势图配置
  const orderTrendConfig = {
    data: orderTrends,
    xField: 'date',
    yField: 'orders',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // 收入趋势图配置
  const revenueTrendConfig = {
    data: orderTrends,
    xField: 'date',
    yField: 'revenue',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // 分类统计图配置
  const categoryConfig = {
    data: categoryStats,
    xField: 'category',
    yField: 'count',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      category: {
        alias: '景点分类',
      },
      count: {
        alias: '数量',
      },
    },
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>仪表盘</h2>
          <div className="dashboard-actions">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadDashboardData}
              loading={loading}
            >
              刷新数据
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportOrders}
              loading={exportLoading}
            >
              导出订单
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportSpots}
              loading={exportLoading}
            >
              导出景点
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} className="stats-cards">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总订单数"
                value={stats?.totalOrders || 0}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总收入"
                value={stats?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="景点总数"
                value={stats?.totalScenicSpots || 0}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="今日订单"
                value={stats?.todayOrders || 0}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} className="charts-section">
          <Col xs={24} lg={12}>
            <Card title="订单趋势" loading={loading}>
              <Line {...orderTrendConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="收入趋势" loading={loading}>
              <Line {...revenueTrendConfig} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="景点分类统计" loading={loading}>
              <Column {...categoryConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="订单状态统计" loading={loading}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="待确认"
                    value={stats?.orderStatusStats.pending || 0}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="已确认"
                    value={stats?.orderStatusStats.confirmed || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="已取消"
                    value={stats?.orderStatusStats.cancelled || 0}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="已完成"
                    value={stats?.orderStatusStats.completed || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;