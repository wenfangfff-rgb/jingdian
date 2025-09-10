import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { 
  DashboardOutlined, 
  PictureOutlined, 
  FileOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import './AdminLayout.css';

const { Content, Sider } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    // 验证是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('请先登录');
      navigate('/admin');
      return;
    }
    
    // 验证token有效性
    authApi.verify()
      .catch(() => {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        navigate('/admin');
      });
  }, [navigate]);
  
  const handleLogout = () => {
    authApi.logout();
    message.success('已退出登录');
    navigate('/admin');
  };
  
  return (
    <Layout className="admin-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="admin-sider"
        breakpoint="lg"
      >
        <div className="admin-logo">
          {!collapsed ? '景点预订管理' : '管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/admin/dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/admin/dashboard">仪表盘</Link>,
            },
            {
              key: '/admin/scenic',
              icon: <PictureOutlined />,
              label: <Link to="/admin/scenic">景点管理</Link>,
            },
            {
              key: '/admin/orders',
              icon: <FileOutlined />,
              label: <Link to="/admin/orders">订单管理</Link>,
            },
          ]}
        />
        <div className="logout-button-container">
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="logout-button"
          >
            {!collapsed && '退出登录'}
          </Button>
        </div>
      </Sider>
      <Layout className="admin-content-layout">
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;