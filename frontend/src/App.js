import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScenicSpotDetail from './pages/ScenicSpotDetail';
import Booking from './pages/Booking';
import OrderSuccess from './pages/OrderSuccess';
import OrderQuery from './pages/OrderQuery';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminScenicSpots from './pages/admin/ScenicSpots';
import AdminOrders from './pages/admin/Orders';
import './App.css';
function App() {
    return (_jsx(ConfigProvider, { locale: zhCN, children: _jsx(Router, { children: _jsx("div", { className: "App", children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "scenic-spot/:id", element: _jsx(ScenicSpotDetail, {}) }), _jsx(Route, { path: "booking/:id", element: _jsx(Booking, {}) }), _jsx(Route, { path: "order-success/:orderId", element: _jsx(OrderSuccess, {}) }), _jsx(Route, { path: "order-query", element: _jsx(OrderQuery, {}) })] }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/scenic-spots", element: _jsx(AdminScenicSpots, {}) }), _jsx(Route, { path: "/admin/orders", element: _jsx(AdminOrders, {}) })] }) }) }) }));
}
export default App;
