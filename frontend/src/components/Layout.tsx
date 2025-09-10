import React from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import './Layout.css';

const { Header, Content, Footer } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/order-query',
      icon: <SearchOutlined />,
      label: '订单查询'
    }
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <AntLayout className="main-layout">
      <Header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <h2>景点预订系统</h2>
          </div>
          
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
            className="nav-menu"
          />
          
          <div className="header-actions">
            <Button 
              type="link" 
              icon={<PhoneOutlined />}
              className="contact-btn"
            >
              400-123-4567
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate('/admin/login')}
              className="admin-btn"
            >
              管理后台
            </Button>
          </div>
        </div>
      </Header>
      
      <Content className="content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>
      
      <Footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>联系我们</h4>
            <p>客服热线：400-123-4567</p>
            <p>服务时间：9:00 - 18:00</p>
            <p>邮箱：service@scenic-booking.com</p>
          </div>
          
          <div className="footer-section">
            <h4>帮助中心</h4>
            <p>预订流程</p>
            <p>退改政策</p>
            <p>常见问题</p>
          </div>
          
          <div className="footer-section">
            <h4>关于我们</h4>
            <p>公司介绍</p>
            <p>服务条款</p>
            <p>隐私政策</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 景点预订系统. All rights reserved.</p>
        </div>
      </Footer>
    </AntLayout>
  );
};

export default Layout;