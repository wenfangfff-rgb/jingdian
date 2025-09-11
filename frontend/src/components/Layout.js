import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout as AntLayout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import './Layout.css';
const { Header, Content, Footer } = AntLayout;
const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
        {
            key: '/',
            icon: _jsx(HomeOutlined, {}),
            label: '首页'
        },
        {
            key: '/order-query',
            icon: _jsx(SearchOutlined, {}),
            label: '订单查询'
        }
    ];
    const handleMenuClick = (key) => {
        navigate(key);
    };
    return (_jsxs(AntLayout, { className: "main-layout", children: [_jsx(Header, { className: "header", children: _jsxs("div", { className: "header-content", children: [_jsx("div", { className: "logo", onClick: () => navigate('/'), children: _jsx("h2", { children: "\u666F\u70B9\u9884\u8BA2\u7CFB\u7EDF" }) }), _jsx(Menu, { theme: "dark", mode: "horizontal", selectedKeys: [location.pathname], items: menuItems, onClick: ({ key }) => handleMenuClick(key), className: "nav-menu" }), _jsxs("div", { className: "header-actions", children: [_jsx(Button, { type: "link", icon: _jsx(PhoneOutlined, {}), className: "contact-btn", children: "400-123-4567" }), _jsx(Button, { type: "primary", onClick: () => navigate('/admin/login'), className: "admin-btn", children: "\u7BA1\u7406\u540E\u53F0" })] })] }) }), _jsx(Content, { className: "content", children: _jsx("div", { className: "content-wrapper", children: _jsx(Outlet, {}) }) }), _jsxs(Footer, { className: "footer", children: [_jsxs("div", { className: "footer-content", children: [_jsxs("div", { className: "footer-section", children: [_jsx("h4", { children: "\u8054\u7CFB\u6211\u4EEC" }), _jsx("p", { children: "\u5BA2\u670D\u70ED\u7EBF\uFF1A400-123-4567" }), _jsx("p", { children: "\u670D\u52A1\u65F6\u95F4\uFF1A9:00 - 18:00" }), _jsx("p", { children: "\u90AE\u7BB1\uFF1Aservice@scenic-booking.com" })] }), _jsxs("div", { className: "footer-section", children: [_jsx("h4", { children: "\u5E2E\u52A9\u4E2D\u5FC3" }), _jsx("p", { children: "\u9884\u8BA2\u6D41\u7A0B" }), _jsx("p", { children: "\u9000\u6539\u653F\u7B56" }), _jsx("p", { children: "\u5E38\u89C1\u95EE\u9898" })] }), _jsxs("div", { className: "footer-section", children: [_jsx("h4", { children: "\u5173\u4E8E\u6211\u4EEC" }), _jsx("p", { children: "\u516C\u53F8\u4ECB\u7ECD" }), _jsx("p", { children: "\u670D\u52A1\u6761\u6B3E" }), _jsx("p", { children: "\u9690\u79C1\u653F\u7B56" })] })] }), _jsx("div", { className: "footer-bottom", children: _jsx("p", { children: "\u00A9 2024 \u666F\u70B9\u9884\u8BA2\u7CFB\u7EDF. All rights reserved." }) })] })] }));
};
export default Layout;
