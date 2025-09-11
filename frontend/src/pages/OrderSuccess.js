import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Result, Descriptions, Spin, message } from 'antd';
import { CheckCircleOutlined, HomeOutlined, CopyOutlined } from '@ant-design/icons';
import { OrderService } from '../services/orderService';
import dayjs from 'dayjs';
import './OrderSuccess.css';
const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                message.error('订单ID不存在');
                navigate('/');
                return;
            }
            try {
                setLoading(true);
                const response = await OrderService.getDetail(orderId);
                // 转换Order类型到OrderDetail类型
                const orderData = response.data;
                const orderDetail = {
                    id: orderData.id,
                    orderNumber: orderData.orderNumber,
                    scenicSpotName: orderData.scenicSpotName,
                    specificationName: orderData.specification.name,
                    customerName: orderData.customerInfo.name,
                    customerPhone: orderData.customerInfo.phone,
                    customerEmail: orderData.customerInfo.email,
                    visitDate: orderData.visitDate,
                    quantity: orderData.quantity,
                    totalPrice: orderData.totalAmount,
                    status: orderData.status,
                    createdAt: orderData.createdAt,
                    specialRequests: orderData.notes
                };
                setOrder(orderDetail);
            }
            catch (error) {
                console.error('获取订单详情失败:', error);
                message.error('获取订单详情失败');
                navigate('/');
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, navigate]);
    const copyOrderNumber = () => {
        if (order?.orderNumber) {
            navigator.clipboard.writeText(order.orderNumber);
            message.success('订单号已复制到剪贴板');
        }
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
    if (loading) {
        return (_jsx("div", { className: "loading-container", children: _jsx(Spin, { size: "large" }) }));
    }
    if (!order) {
        return (_jsx("div", { className: "error-container", children: _jsx(Result, { status: "error", title: "\u8BA2\u5355\u4FE1\u606F\u83B7\u53D6\u5931\u8D25", subTitle: "\u8BF7\u68C0\u67E5\u8BA2\u5355\u53F7\u662F\u5426\u6B63\u786E\u6216\u7A0D\u540E\u91CD\u8BD5", extra: [
                    _jsx(Button, { type: "primary", onClick: () => navigate('/'), children: "\u8FD4\u56DE\u9996\u9875" }, "home")
                ] }) }));
    }
    return (_jsxs("div", { className: "order-success-page", children: [_jsx(Result, { icon: _jsx(CheckCircleOutlined, { style: { color: '#52c41a' } }), status: "success", title: "\u9884\u8BA2\u6210\u529F\uFF01", subTitle: "\u60A8\u7684\u95E8\u7968\u9884\u8BA2\u5DF2\u63D0\u4EA4\u6210\u529F\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u4E3A\u60A8\u786E\u8BA4\u8BA2\u5355\u3002", className: "success-result" }), _jsx(Card, { className: "order-detail-card", title: "\u8BA2\u5355\u8BE6\u60C5", children: _jsxs(Descriptions, { column: 1, bordered: true, children: [_jsxs(Descriptions.Item, { label: "\u8BA2\u5355\u53F7", children: [_jsx("span", { className: "order-number", children: order.orderNumber }), _jsx(Button, { type: "link", icon: _jsx(CopyOutlined, {}), onClick: copyOrderNumber, size: "small", children: "\u590D\u5236" })] }), _jsx(Descriptions.Item, { label: "\u666F\u70B9\u540D\u79F0", children: order.scenicSpotName }), _jsx(Descriptions.Item, { label: "\u95E8\u7968\u89C4\u683C", children: order.specificationName }), _jsx(Descriptions.Item, { label: "\u8054\u7CFB\u4EBA", children: order.customerName }), _jsx(Descriptions.Item, { label: "\u8054\u7CFB\u7535\u8BDD", children: order.customerPhone }), order.customerEmail && (_jsx(Descriptions.Item, { label: "\u90AE\u7BB1", children: order.customerEmail })), _jsx(Descriptions.Item, { label: "\u6E38\u89C8\u65E5\u671F", children: dayjs(order.visitDate).format('YYYY年MM月DD日') }), _jsxs(Descriptions.Item, { label: "\u8D2D\u4E70\u6570\u91CF", children: [order.quantity, " \u5F20"] }), _jsx(Descriptions.Item, { label: "\u8BA2\u5355\u91D1\u989D", children: _jsxs("span", { className: "total-price", children: ["\u00A5", order.totalPrice] }) }), _jsx(Descriptions.Item, { label: "\u8BA2\u5355\u72B6\u6001", children: _jsx("span", { className: `status status-${order.status}`, children: getStatusText(order.status) }) }), _jsx(Descriptions.Item, { label: "\u4E0B\u5355\u65F6\u95F4", children: dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss') }), order.specialRequests && (_jsx(Descriptions.Item, { label: "\u7279\u6B8A\u8981\u6C42", children: order.specialRequests }))] }) }), _jsx(Card, { className: "notice-card", title: "\u6E29\u99A8\u63D0\u793A", children: _jsxs("div", { className: "notice-content", children: [_jsx("p", { children: "\u2022 \u8BF7\u4FDD\u5B58\u597D\u60A8\u7684\u8BA2\u5355\u53F7\uFF0C\u4EE5\u4FBF\u67E5\u8BE2\u548C\u4F7F\u7528" }), _jsx("p", { children: "\u2022 \u6211\u4EEC\u4F1A\u572824\u5C0F\u65F6\u5185\u786E\u8BA4\u60A8\u7684\u8BA2\u5355" }), _jsx("p", { children: "\u2022 \u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\uFF1A400-123-4567" }), _jsx("p", { children: "\u2022 \u8BF7\u5728\u6E38\u89C8\u5F53\u65E5\u643A\u5E26\u6709\u6548\u8EAB\u4EFD\u8BC1\u4EF6" }), _jsx("p", { children: "\u2022 \u95E8\u7968\u4E00\u7ECF\u786E\u8BA4\uFF0C\u4E0D\u652F\u6301\u9000\u6539" })] }) }), _jsxs("div", { className: "action-buttons", children: [_jsx(Button, { type: "primary", icon: _jsx(HomeOutlined, {}), size: "large", onClick: () => navigate('/'), className: "home-button", children: "\u8FD4\u56DE\u9996\u9875" }), _jsx(Button, { size: "large", onClick: () => navigate('/order-query'), className: "query-button", children: "\u67E5\u8BE2\u8BA2\u5355" })] })] }));
};
export default OrderSuccess;
