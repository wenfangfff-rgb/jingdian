import React from 'react';
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
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            {/* 前台路由 */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="scenic-spot/:id" element={<ScenicSpotDetail />} />
              <Route path="booking/:id" element={<Booking />} />
              <Route path="order-success/:orderId" element={<OrderSuccess />} />
              <Route path="order-query" element={<OrderQuery />} />
            </Route>
            
            {/* 后台管理路由 */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/scenic-spots" element={<AdminScenicSpots />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;