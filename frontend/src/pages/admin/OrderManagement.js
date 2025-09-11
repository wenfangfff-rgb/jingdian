import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, DatePicker, Form, message, Popconfirm, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { orderApi } from '../../api';
import { formatDate, formatPrice } from '../../utils';
import AdminLayout from '../../components/AdminLayout';
import './OrderManagement.css';
const { RangePicker } = DatePicker;
const OrderManagement = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize] = useState(10);
    const [searchForm] = Form.useForm();
    // 获取订单列表
    const fetchOrderList = async (page = currentPage, filters = {}) => {
        try {
            setLoading(true);
            const response = await orderApi.getAll(page, pageSize, filters);
            setOrderList(response.data);
            setTotal(response.total);
        }
        catch (error) {
            console.error('获取订单列表失败:', error);
            message.error('获取订单列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrderList();
    }, []);
    // 处理页码变化
    const handlePageChange = (page) => {
        setCurrentPage(page);
        const values = searchForm.getFieldsValue();
        fetchOrderList(page, values);
    };
    // 查看订单详情
    const showOrderDetail = (record) => {
        setCurrentOrder(record);
        setDetailModalVisible(true);
    };
    // 处理删除订单
    const handleDelete = async (id) => {
        try {
            await orderApi.delete(id);
            message.success('订单删除成功');
            fetchOrderList();
        }
        catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败，请重试');
        }
    };
    // 处理搜索
    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        setCurrentPage(1);
        fetchOrderList(1, values);
    };
    // 重置搜索
    const handleReset = () => {
        searchForm.resetFields();
        setCurrentPage(1);
        fetchOrderList(1, {});
    };
    // 导出订单数据
    const handleExport = async () => {
        try {
            message.loading('正在导出数据...');
            const values = searchForm.getFieldsValue();
            await orderApi.exportOrders(values);
            message.success('导出成功');
        }
        catch (error) {
            console.error('导出失败:', error);
            message.error('导出失败，请重试');
        }
    };
    // 订单表格列定义
    const columns = [
        {
            title: '订单号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            ellipsis: true,
        },
        {
            title: '景点名称',
            dataIndex: 'scenicName',
            key: 'scenicName',
        },
        {
            title: '规格',
            dataIndex: 'specName',
            key: 'specName',
        },
        {
            title: '客户姓名',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '联系电话',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: '操作',
            key: 'action',
            width: 160,
            render: (_, record) => (_jsxs(Space, { size: "small", children: [_jsx(Button, { type: "primary", icon: _jsx(EyeOutlined, {}), onClick: () => showOrderDetail(record), size: "small", children: "\u8BE6\u60C5" }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u8BA2\u5355\u5417\uFF1F", onConfirm: () => handleDelete(record._id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", icon: _jsx(ExclamationCircleOutlined, { style: { color: 'red' } }), children: _jsx(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), size: "small", children: "\u5220\u9664" }) })] })),
        },
    ];
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "order-management-container", children: [_jsxs("div", { className: "table-header", children: [_jsx("h2", { children: "\u8BA2\u5355\u7BA1\u7406" }), _jsx(Button, { type: "primary", icon: _jsx(ExportOutlined, {}), onClick: handleExport, children: "\u5BFC\u51FA\u6570\u636E" })] }), _jsx("div", { className: "search-form", children: _jsx(Form, { form: searchForm, layout: "horizontal", onFinish: handleSearch, children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsx(Form.Item, { name: "keyword", label: "\u5173\u952E\u8BCD", children: _jsx(Input, { placeholder: "\u8BA2\u5355\u53F7/\u666F\u70B9\u540D\u79F0/\u5BA2\u6237\u59D3\u540D" }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsx(Form.Item, { name: "phone", label: "\u8054\u7CFB\u7535\u8BDD", children: _jsx(Input, { placeholder: "\u5BA2\u6237\u8054\u7CFB\u7535\u8BDD" }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsx(Form.Item, { name: "dateRange", label: "\u521B\u5EFA\u65F6\u95F4", children: _jsx(RangePicker, { style: { width: '100%' } }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsxs(Form.Item, { className: "search-buttons", children: [_jsx(Button, { type: "primary", htmlType: "submit", icon: _jsx(SearchOutlined, {}), children: "\u641C\u7D22" }), _jsx(Button, { onClick: handleReset, children: "\u91CD\u7F6E" })] }) })] }) }) }), _jsx(Table, { columns: columns, dataSource: orderList, rowKey: "id", loading: loading, pagination: {
                        current: currentPage,
                        pageSize,
                        total,
                        onChange: handlePageChange,
                        showSizeChanger: false,
                    }, scroll: { x: 'max-content' } }), _jsx(Modal, { title: "\u8BA2\u5355\u8BE6\u60C5", open: detailModalVisible, onCancel: () => setDetailModalVisible(false), footer: [
                        _jsx(Button, { onClick: () => setDetailModalVisible(false), children: "\u5173\u95ED" }, "close")
                    ], width: 600, children: currentOrder && (_jsxs("div", { className: "order-detail", children: [_jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u8BA2\u5355\u53F7\uFF1A" }), _jsx("span", { className: "detail-value", children: currentOrder._id })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u666F\u70B9\u540D\u79F0\uFF1A" }), _jsx("span", { className: "detail-value", children: currentOrder.scenicName })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u89C4\u683C\uFF1A" }), _jsx("span", { className: "detail-value", children: currentOrder.specName })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u4EF7\u683C\uFF1A" }), _jsx("span", { className: "detail-value", children: formatPrice(currentOrder.price) })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u5BA2\u6237\u59D3\u540D\uFF1A" }), _jsx("span", { className: "detail-value", children: currentOrder.customerName })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u8054\u7CFB\u7535\u8BDD\uFF1A" }), _jsx("span", { className: "detail-value", children: currentOrder.customerPhone })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u521B\u5EFA\u65F6\u95F4\uFF1A" }), _jsx("span", { className: "detail-value", children: formatDate(currentOrder.createdAt) })] }), _jsxs("div", { className: "detail-item", children: [_jsx("span", { className: "detail-label", children: "\u5907\u6CE8\uFF1A" }), _jsx("span", { className: "detail-value", children: "\u65E0" })] })] })) })] }) }));
};
export default OrderManagement;
