import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, Input, DatePicker, Space, Tag, Card, Descriptions, message, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { OrderService } from '../../services/orderService';
import './Orders.css';
const { Option } = Select;
const { RangePicker } = DatePicker;
const AdminOrders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchForm] = Form.useForm();
    const [detailVisible, setDetailVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editForm] = Form.useForm();
    // 订单状态选项
    const statusOptions = [
        { label: '待确认', value: 'pending', color: 'orange' },
        { label: '已确认', value: 'confirmed', color: 'green' },
        { label: '已取消', value: 'cancelled', color: 'red' },
        { label: '已完成', value: 'completed', color: 'blue' }
    ];
    // 支付状态选项
    const paymentStatusOptions = [
        { label: '未支付', value: 'unpaid', color: 'orange' },
        { label: '已支付', value: 'paid', color: 'green' },
        { label: '已退款', value: 'refunded', color: 'red' }
    ];
    // 加载订单列表
    const loadOrders = async (params) => {
        setLoading(true);
        try {
            const response = await OrderService.getList({
                page: pagination.current,
                limit: pagination.pageSize,
                ...params
            });
            setOrders(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total
            }));
        }
        catch (error) {
            message.error('加载订单列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadOrders();
    }, []);
    // 处理表格分页
    const handleTableChange = (paginationConfig) => {
        setPagination(prev => ({
            ...prev,
            current: paginationConfig.current,
            pageSize: paginationConfig.pageSize
        }));
        loadOrders();
    };
    // 搜索订单
    const handleSearch = (values) => {
        const params = {};
        if (values.search) {
            params.search = values.search;
        }
        if (values.status) {
            params.status = values.status;
        }
        if (values.paymentStatus) {
            params.paymentStatus = values.paymentStatus;
        }
        if (values.dateRange && values.dateRange.length === 2) {
            params.startDate = values.dateRange[0].format('YYYY-MM-DD');
            params.endDate = values.dateRange[1].format('YYYY-MM-DD');
        }
        setPagination(prev => ({ ...prev, current: 1 }));
        loadOrders(params);
    };
    // 重置搜索
    const handleReset = () => {
        searchForm.resetFields();
        setPagination(prev => ({ ...prev, current: 1 }));
        loadOrders();
    };
    // 查看订单详情
    const showOrderDetail = (order) => {
        setSelectedOrder(order);
        setDetailVisible(true);
    };
    // 编辑订单状态
    const showEditModal = (order) => {
        setSelectedOrder(order);
        editForm.setFieldsValue({
            status: order.status,
            paymentStatus: order.paymentStatus,
            notes: order.notes
        });
        setEditVisible(true);
    };
    // 更新订单状态
    const handleUpdateOrder = async (values) => {
        if (!selectedOrder)
            return;
        try {
            await OrderService.updateStatus(selectedOrder.id, values);
            message.success('订单状态更新成功');
            setEditVisible(false);
            loadOrders();
        }
        catch (error) {
            message.error(error.response?.data?.error || '更新失败');
        }
    };
    // 删除订单
    const handleDeleteOrder = async (id) => {
        try {
            await OrderService.delete(id);
            message.success('订单删除成功');
            loadOrders();
        }
        catch (error) {
            message.error(error.response?.data?.error || '删除失败');
        }
    };
    // 获取状态标签
    const getStatusTag = (status, options) => {
        const option = options.find(opt => opt.value === status);
        return option ? (_jsx(Tag, { color: option.color, children: option.label })) : status;
    };
    // 表格列定义
    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: 150,
        },
        {
            title: '景点名称',
            dataIndex: 'scenicSpotName',
            key: 'scenicSpotName',
            width: 150,
        },
        {
            title: '客户信息',
            key: 'customer',
            width: 150,
            render: (_, record) => (_jsxs("div", { children: [_jsx("div", { children: record.customerInfo.name }), _jsx("div", { style: { fontSize: '12px', color: '#666' }, children: record.customerInfo.phone })] }))
        },
        {
            title: '规格',
            dataIndex: ['specification', 'name'],
            key: 'specification',
            width: 120,
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
        },
        {
            title: '总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 100,
            render: (amount) => `¥${amount}`
        },
        {
            title: '游览日期',
            dataIndex: 'visitDate',
            key: 'visitDate',
            width: 120,
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => getStatusTag(status, statusOptions)
        },
        {
            title: '支付状态',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 100,
            render: (status) => getStatusTag(status, paymentStatusOptions)
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "link", icon: _jsx(EyeOutlined, {}), onClick: () => showOrderDetail(record), children: "\u8BE6\u60C5" }), _jsx(Button, { type: "link", icon: _jsx(EditOutlined, {}), onClick: () => showEditModal(record), children: "\u7F16\u8F91" }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u8BA2\u5355\u5417\uFF1F", onConfirm: () => handleDeleteOrder(record.id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", children: _jsx(Button, { type: "link", danger: true, icon: _jsx(DeleteOutlined, {}), children: "\u5220\u9664" }) })] }))
        }
    ];
    return (_jsxs("div", { className: "admin-orders", children: [_jsxs(Card, { children: [_jsxs("div", { className: "page-header", children: [_jsx("h2", { children: "\u8BA2\u5355\u7BA1\u7406" }), _jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: () => loadOrders(), children: "\u5237\u65B0" })] }), _jsx(Card, { size: "small", className: "search-card", children: _jsxs(Form, { form: searchForm, layout: "inline", onFinish: handleSearch, children: [_jsx(Form.Item, { name: "search", children: _jsx(Input, { placeholder: "\u641C\u7D22\u8BA2\u5355\u53F7\u3001\u5BA2\u6237\u59D3\u540D\u6216\u7535\u8BDD", style: { width: 200 } }) }), _jsx(Form.Item, { name: "status", children: _jsx(Select, { placeholder: "\u8BA2\u5355\u72B6\u6001", style: { width: 120 }, allowClear: true, children: statusOptions.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }), _jsx(Form.Item, { name: "paymentStatus", children: _jsx(Select, { placeholder: "\u652F\u4ED8\u72B6\u6001", style: { width: 120 }, allowClear: true, children: paymentStatusOptions.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }), _jsx(Form.Item, { name: "dateRange", children: _jsx(RangePicker, { placeholder: ['开始日期', '结束日期'] }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), htmlType: "submit", children: "\u641C\u7D22" }), _jsx(Button, { onClick: handleReset, children: "\u91CD\u7F6E" })] }) })] }) }), _jsx(Table, { columns: columns, dataSource: orders, rowKey: "id", loading: loading, pagination: {
                            ...pagination,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条记录`
                        }, onChange: handleTableChange, scroll: { x: 1400 } })] }), _jsx(Modal, { title: "\u8BA2\u5355\u8BE6\u60C5", open: detailVisible, onCancel: () => setDetailVisible(false), footer: [
                    _jsx(Button, { onClick: () => setDetailVisible(false), children: "\u5173\u95ED" }, "close")
                ], width: 800, children: selectedOrder && (_jsxs(Descriptions, { bordered: true, column: 2, children: [_jsx(Descriptions.Item, { label: "\u8BA2\u5355\u53F7", span: 2, children: selectedOrder.orderNumber }), _jsx(Descriptions.Item, { label: "\u666F\u70B9\u540D\u79F0", children: selectedOrder.scenicSpotName }), _jsx(Descriptions.Item, { label: "\u89C4\u683C", children: selectedOrder.specification.name }), _jsxs(Descriptions.Item, { label: "\u5355\u4EF7", children: ["\u00A5", selectedOrder.specification.price] }), _jsx(Descriptions.Item, { label: "\u6570\u91CF", children: selectedOrder.quantity }), _jsxs(Descriptions.Item, { label: "\u603B\u91D1\u989D", span: 2, children: ["\u00A5", selectedOrder.totalAmount] }), _jsx(Descriptions.Item, { label: "\u5BA2\u6237\u59D3\u540D", children: selectedOrder.customerInfo.name }), _jsx(Descriptions.Item, { label: "\u8054\u7CFB\u7535\u8BDD", children: selectedOrder.customerInfo.phone }), _jsx(Descriptions.Item, { label: "\u90AE\u7BB1", children: selectedOrder.customerInfo.email || '未填写' }), _jsx(Descriptions.Item, { label: "\u8EAB\u4EFD\u8BC1\u53F7", children: selectedOrder.customerInfo.idCard || '未填写' }), _jsx(Descriptions.Item, { label: "\u6E38\u89C8\u65E5\u671F", children: new Date(selectedOrder.visitDate).toLocaleDateString() }), _jsx(Descriptions.Item, { label: "\u8BA2\u5355\u72B6\u6001", children: getStatusTag(selectedOrder.status, statusOptions) }), _jsx(Descriptions.Item, { label: "\u652F\u4ED8\u72B6\u6001", children: getStatusTag(selectedOrder.paymentStatus, paymentStatusOptions) }), _jsx(Descriptions.Item, { label: "\u521B\u5EFA\u65F6\u95F4", children: new Date(selectedOrder.createdAt).toLocaleString() }), _jsx(Descriptions.Item, { label: "\u5907\u6CE8", span: 2, children: selectedOrder.notes || '无' })] })) }), _jsx(Modal, { title: "\u7F16\u8F91\u8BA2\u5355\u72B6\u6001", open: editVisible, onCancel: () => setEditVisible(false), footer: null, children: _jsxs(Form, { form: editForm, layout: "vertical", onFinish: handleUpdateOrder, children: [_jsx(Form.Item, { name: "status", label: "\u8BA2\u5355\u72B6\u6001", rules: [{ required: true, message: '请选择订单状态' }], children: _jsx(Select, { placeholder: "\u8BF7\u9009\u62E9\u8BA2\u5355\u72B6\u6001", children: statusOptions.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }), _jsx(Form.Item, { name: "paymentStatus", label: "\u652F\u4ED8\u72B6\u6001", rules: [{ required: true, message: '请选择支付状态' }], children: _jsx(Select, { placeholder: "\u8BF7\u9009\u62E9\u652F\u4ED8\u72B6\u6001", children: paymentStatusOptions.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }), _jsx(Form.Item, { name: "notes", label: "\u5907\u6CE8", children: _jsx(Input.TextArea, { rows: 4, placeholder: "\u8BF7\u8F93\u5165\u5907\u6CE8\u4FE1\u606F" }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: "\u66F4\u65B0" }), _jsx(Button, { onClick: () => setEditVisible(false), children: "\u53D6\u6D88" })] }) })] }) })] }));
};
export default AdminOrders;
