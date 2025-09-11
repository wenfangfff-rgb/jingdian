import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, DatePicker, Select, message } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, EnvironmentOutlined, CalendarOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';
import { AdminService } from '../../services/adminService';
import AdminLayout from '../../components/AdminLayout';
import './Dashboard.css';
const { RangePicker } = DatePicker;
const { Option } = Select;
const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [orderTrends, setOrderTrends] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
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
        }
        catch (error) {
            message.error('加载数据失败');
        }
        finally {
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
        }
        catch (error) {
            message.error('导出失败');
        }
        finally {
            setExportLoading(false);
        }
    };
    // 导出景点数据
    const handleExportSpots = async () => {
        setExportLoading(true);
        try {
            await AdminService.exportScenicSpots();
            message.success('景点数据导出成功');
        }
        catch (error) {
            message.error('导出失败');
        }
        finally {
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
            position: 'middle',
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
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "admin-dashboard", children: [_jsxs("div", { className: "dashboard-header", children: [_jsx("h2", { children: "\u4EEA\u8868\u76D8" }), _jsxs("div", { className: "dashboard-actions", children: [_jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: loadDashboardData, loading: loading, children: "\u5237\u65B0\u6570\u636E" }), _jsx(Button, { icon: _jsx(DownloadOutlined, {}), onClick: handleExportOrders, loading: exportLoading, children: "\u5BFC\u51FA\u8BA2\u5355" }), _jsx(Button, { icon: _jsx(DownloadOutlined, {}), onClick: handleExportSpots, loading: exportLoading, children: "\u5BFC\u51FA\u666F\u70B9" })] })] }), _jsxs(Row, { gutter: [16, 16], className: "stats-cards", children: [_jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u603B\u8BA2\u5355\u6570", value: stats?.totalOrders || 0, prefix: _jsx(ShoppingCartOutlined, {}), valueStyle: { color: '#3f8600' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u603B\u6536\u5165", value: stats?.totalRevenue || 0, prefix: _jsx(DollarOutlined, {}), precision: 2, valueStyle: { color: '#cf1322' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u666F\u70B9\u603B\u6570", value: stats?.totalScenicSpots || 0, prefix: _jsx(EnvironmentOutlined, {}), valueStyle: { color: '#1890ff' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "\u4ECA\u65E5\u8BA2\u5355", value: stats?.todayOrders || 0, prefix: _jsx(CalendarOutlined, {}), valueStyle: { color: '#722ed1' } }) }) })] }), _jsxs(Row, { gutter: [16, 16], className: "charts-section", children: [_jsx(Col, { xs: 24, lg: 12, children: _jsx(Card, { title: "\u8BA2\u5355\u8D8B\u52BF", loading: loading, children: _jsx(Line, { ...orderTrendConfig }) }) }), _jsx(Col, { xs: 24, lg: 12, children: _jsx(Card, { title: "\u6536\u5165\u8D8B\u52BF", loading: loading, children: _jsx(Line, { ...revenueTrendConfig }) }) })] }), _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { xs: 24, lg: 12, children: _jsx(Card, { title: "\u666F\u70B9\u5206\u7C7B\u7EDF\u8BA1", loading: loading, children: _jsx(Column, { ...categoryConfig }) }) }), _jsx(Col, { xs: 24, lg: 12, children: _jsx(Card, { title: "\u8BA2\u5355\u72B6\u6001\u7EDF\u8BA1", loading: loading, children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Statistic, { title: "\u5F85\u786E\u8BA4", value: stats?.orderStatusStats.pending || 0, valueStyle: { color: '#faad14' } }) }), _jsx(Col, { span: 12, children: _jsx(Statistic, { title: "\u5DF2\u786E\u8BA4", value: stats?.orderStatusStats.confirmed || 0, valueStyle: { color: '#52c41a' } }) }), _jsx(Col, { span: 12, children: _jsx(Statistic, { title: "\u5DF2\u53D6\u6D88", value: stats?.orderStatusStats.cancelled || 0, valueStyle: { color: '#ff4d4f' } }) }), _jsx(Col, { span: 12, children: _jsx(Statistic, { title: "\u5DF2\u5B8C\u6210", value: stats?.orderStatusStats.completed || 0, valueStyle: { color: '#1890ff' } }) })] }) }) })] })] }) }));
};
export default AdminDashboard;
