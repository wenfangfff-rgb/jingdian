import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Form, Input, Button, Table, message, Empty, Tag } from 'antd';
import { SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import { OrderService } from '../services/orderService';
import dayjs from 'dayjs';
import './OrderQuery.css';
const OrderQuery = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searched, setSearched] = useState(false);
    const handleSearch = async (values) => {
        if (!values.orderNumber && !values.customerPhone) {
            message.warning('请输入订单号或手机号进行查询');
            return;
        }
        try {
            setLoading(true);
            let orders = [];
            if (values.orderNumber) {
                const response = await OrderService.searchByOrderNumber(values.orderNumber);
                orders = [response.data];
            }
            else {
                // 如果只有手机号，使用getList方法搜索
                const response = await OrderService.getList({ search: values.customerPhone });
                orders = response.data;
            }
            setOrders(orders);
            setSearched(true);
            if (orders.length === 0) {
                message.info('未找到相关订单');
            }
        }
        catch (error) {
            console.error('查询订单失败:', error);
            message.error('查询订单失败，请重试');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        const colorMap = {
            'pending': 'orange',
            'confirmed': 'green',
            'cancelled': 'red',
            'completed': 'blue'
        };
        return colorMap[status] || 'default';
    };
    const getStatusText = (status) => {
        const statusMap = {
            'pending': '待确认',
            'confirmed': '已确认',
            'cancelled': '已取消',
            'completed': '已完成'
        };
        return statusMap[status] || status;
    };
    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: 180,
            render: (text) => (_jsx("span", { className: "order-number", children: text }))
        },
        {
            title: '景点名称',
            dataIndex: 'scenicSpotName',
            key: 'scenicSpotName',
            width: 200
        },
        {
            title: '门票规格',
            dataIndex: 'specificationName',
            key: 'specificationName',
            width: 150
        },
        {
            title: '联系人',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 100
        },
        {
            title: '游览日期',
            dataIndex: 'visitDate',
            key: 'visitDate',
            width: 120,
            render: (date) => dayjs(date).format('MM-DD')
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            render: (quantity) => `${quantity}张`
        },
        {
            title: '金额',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100,
            render: (price) => (_jsxs("span", { className: "price", children: ["\u00A5", price] }))
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (_jsx(Tag, { color: getStatusColor(status), children: getStatusText(status) }))
        },
        {
            title: '下单时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date) => dayjs(date).format('MM-DD HH:mm')
        }
    ];
    return (_jsxs("div", { className: "order-query-page", children: [_jsxs("div", { className: "page-header", children: [_jsx("h2", { children: "\u8BA2\u5355\u67E5\u8BE2" }), _jsx("p", { children: "\u8BF7\u8F93\u5165\u8BA2\u5355\u53F7\u6216\u9884\u8BA2\u65F6\u7684\u624B\u673A\u53F7\u8FDB\u884C\u67E5\u8BE2" })] }), _jsx(Card, { className: "search-card", children: _jsxs(Form, { form: form, layout: "inline", onFinish: handleSearch, className: "search-form", children: [_jsx(Form.Item, { name: "orderNumber", className: "search-item", children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u8BA2\u5355\u53F7", prefix: _jsx(SearchOutlined, {}), size: "large", style: { width: 250 } }) }), _jsx(Form.Item, { className: "search-divider", children: _jsx("span", { children: "\u6216" }) }), _jsx(Form.Item, { name: "customerPhone", className: "search-item", children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u9884\u8BA2\u624B\u673A\u53F7", prefix: _jsx(PhoneOutlined, {}), size: "large", style: { width: 200 } }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", size: "large", loading: loading, icon: _jsx(SearchOutlined, {}), children: "\u67E5\u8BE2\u8BA2\u5355" }) })] }) }), searched && (_jsx(Card, { className: "result-card", title: "\u67E5\u8BE2\u7ED3\u679C", children: orders.length > 0 ? (_jsx(Table, { columns: columns, dataSource: orders, rowKey: "id", pagination: {
                        pageSize: 10,
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }, scroll: { x: 1200 } })) : (_jsx(Empty, { description: "\u672A\u627E\u5230\u76F8\u5173\u8BA2\u5355", image: Empty.PRESENTED_IMAGE_SIMPLE, children: _jsx("p", { children: "\u8BF7\u68C0\u67E5\u8F93\u5165\u4FE1\u606F\u662F\u5426\u6B63\u786E\uFF0C\u6216\u8054\u7CFB\u5BA2\u670D\uFF1A400-123-4567" }) })) })), _jsx(Card, { className: "help-card", title: "\u67E5\u8BE2\u5E2E\u52A9", children: _jsxs("div", { className: "help-content", children: [_jsx("h4", { children: "\u67E5\u8BE2\u65B9\u5F0F\uFF1A" }), _jsxs("ul", { children: [_jsx("li", { children: "\u65B9\u5F0F\u4E00\uFF1A\u8F93\u5165\u5B8C\u6574\u7684\u8BA2\u5355\u53F7\u8FDB\u884C\u67E5\u8BE2" }), _jsx("li", { children: "\u65B9\u5F0F\u4E8C\uFF1A\u8F93\u5165\u9884\u8BA2\u65F6\u4F7F\u7528\u7684\u624B\u673A\u53F7\u67E5\u8BE2\u8BE5\u53F7\u7801\u4E0B\u7684\u6240\u6709\u8BA2\u5355" })] }), _jsx("h4", { children: "\u8BA2\u5355\u72B6\u6001\u8BF4\u660E\uFF1A" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx(Tag, { color: "orange", children: "\u5F85\u786E\u8BA4" }), " - \u8BA2\u5355\u5DF2\u63D0\u4EA4\uFF0C\u7B49\u5F85\u786E\u8BA4"] }), _jsxs("li", { children: [_jsx(Tag, { color: "green", children: "\u5DF2\u786E\u8BA4" }), " - \u8BA2\u5355\u5DF2\u786E\u8BA4\uFF0C\u53EF\u6B63\u5E38\u4F7F\u7528"] }), _jsxs("li", { children: [_jsx(Tag, { color: "blue", children: "\u5DF2\u5B8C\u6210" }), " - \u5DF2\u5B8C\u6210\u6E38\u89C8"] }), _jsxs("li", { children: [_jsx(Tag, { color: "red", children: "\u5DF2\u53D6\u6D88" }), " - \u8BA2\u5355\u5DF2\u53D6\u6D88"] })] }), _jsx("h4", { children: "\u8054\u7CFB\u6211\u4EEC\uFF1A" }), _jsxs("p", { children: ["\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u70ED\u7EBF\uFF1A", _jsx("strong", { children: "400-123-4567" })] }), _jsx("p", { children: "\u670D\u52A1\u65F6\u95F4\uFF1A\u6BCF\u5929 9:00 - 18:00" })] }) })] }));
};
export default OrderQuery;
