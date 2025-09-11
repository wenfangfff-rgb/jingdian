import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
const { Header: AntHeader } = Layout;
const Header = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    return (_jsx(AntHeader, { className: "header", children: _jsxs("div", { className: "container header-container", children: [_jsx("div", { className: "logo", children: _jsx(Link, { to: "/", children: "\u666F\u70B9\u9884\u8BA2\u7F51\u7AD9" }) }), _jsx(Menu, { theme: "dark", mode: "horizontal", selectedKeys: [location.pathname], className: "header-menu", items: [
                        {
                            key: '/',
                            label: _jsx(Link, { to: "/", children: "\u9996\u9875" }),
                            style: { display: isAdmin ? 'none' : 'block' }
                        },
                        {
                            key: '/admin',
                            label: isAdmin ? (_jsx(Link, { to: "/admin/dashboard", children: "\u7BA1\u7406\u540E\u53F0" })) : (_jsx(Link, { to: "/admin", children: "\u7BA1\u7406\u5165\u53E3" }))
                        }
                    ] })] }) }));
};
export default Header;
