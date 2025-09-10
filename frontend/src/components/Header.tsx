import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AntHeader className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">景点预订网站</Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="header-menu"
          items={[
            {
              key: '/',
              label: <Link to="/">首页</Link>,
              style: { display: isAdmin ? 'none' : 'block' }
            },
            {
              key: '/admin',
              label: isAdmin ? (
                <Link to="/admin/dashboard">管理后台</Link>
              ) : (
                <Link to="/admin">管理入口</Link>
              )
            }
          ]}
        />
      </div>
    </AntHeader>
  );
};

export default Header;