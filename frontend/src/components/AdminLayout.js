import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { DashboardOutlined, PictureOutlined, FileOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import './AdminLayout.css';
const { Content, Sider } = Layout;
const AdminLayout = ({ children }) => {
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
    return (_jsxs(Layout, { className: "admin-layout", children: [_jsxs(Sider, { collapsible: true, collapsed: collapsed, onCollapse: setCollapsed, className: "admin-sider", breakpoint: "lg", children: [_jsx("div", { className: "admin-logo", children: !collapsed ? '景点预订管理' : '管理' }), _jsx(Menu, { theme: "dark", mode: "inline", selectedKeys: [location.pathname], items: [
                            {
                                key: '/admin/dashboard',
                                icon: _jsx(DashboardOutlined, {}),
                                label: _jsx(Link, { to: "/admin/dashboard", children: "\u4EEA\u8868\u76D8" }),
                            },
                            {
                                key: '/admin/scenic',
                                icon: _jsx(PictureOutlined, {}),
                                label: _jsx(Link, { to: "/admin/scenic", children: "\u666F\u70B9\u7BA1\u7406" }),
                            },
                            {
                                key: '/admin/orders',
                                icon: _jsx(FileOutlined, {}),
                                label: _jsx(Link, { to: "/admin/orders", children: "\u8BA2\u5355\u7BA1\u7406" }),
                            },
                        ] }), _jsx("div", { className: "logout-button-container", children: _jsx(Button, { type: "text", icon: _jsx(LogoutOutlined, {}), onClick: handleLogout, className: "logout-button", children: !collapsed && '退出登录' }) })] }), _jsx(Layout, { className: "admin-content-layout", children: _jsx(Content, { className: "admin-content", children: children }) })] }));
};
export default AdminLayout;
