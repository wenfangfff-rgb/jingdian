import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, DatePicker, InputNumber, Button, Spin, message, Descriptions } from 'antd';
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { ScenicSpotService } from '../services/scenicSpotService';
import { OrderService } from '../services/orderService';
import dayjs from 'dayjs';
import './Booking.css';
const { TextArea } = Input;
const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const specId = searchParams.get('spec');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [scenicSpot, setScenicSpot] = useState(null);
    const [selectedSpec, setSelectedSpec] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!id || !specId) {
                message.error('缺少必要参数');
                navigate('/');
                return;
            }
            try {
                setLoading(true);
                const response = await ScenicSpotService.getDetail(id);
                const spot = response.data;
                setScenicSpot(spot);
                // 找到选中的规格
                const specIndex = parseInt(specId);
                const spec = spot.specifications?.[specIndex];
                if (!spec) {
                    message.error('门票规格不存在');
                    navigate(`/scenic-spot/${id}`);
                    return;
                }
                setSelectedSpec(spec);
                // 设置默认值
                form.setFieldsValue({
                    quantity: 1,
                    visitDate: dayjs().add(1, 'day')
                });
            }
            catch (error) {
                console.error('获取景点信息失败:', error);
                message.error('获取景点信息失败');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, specId, navigate, form]);
    const handleSubmit = async (values) => {
        if (!scenicSpot || !selectedSpec)
            return;
        try {
            setSubmitting(true);
            const orderData = {
                scenicSpotId: id,
                specificationIndex: parseInt(searchParams.get('spec') || '0'),
                quantity: values.quantity,
                customerInfo: {
                    name: values.customerName,
                    phone: values.customerPhone,
                    email: values.customerEmail
                },
                visitDate: values.visitDate.format('YYYY-MM-DD'),
                notes: values.specialRequests
            };
            const response = await OrderService.create(orderData);
            message.success('预订成功！');
            navigate(`/order-success/${response.data.id}`);
        }
        catch (error) {
            console.error('提交订单失败:', error);
            message.error('提交订单失败，请重试');
        }
        finally {
            setSubmitting(false);
        }
    };
    const calculateTotal = () => {
        const quantity = form.getFieldValue('quantity') || 1;
        return selectedSpec ? selectedSpec.price * quantity : 0;
    };
    if (loading) {
        return (_jsx("div", { className: "loading-container", children: _jsx(Spin, { size: "large" }) }));
    }
    if (!scenicSpot || !selectedSpec) {
        return (_jsxs("div", { className: "error-container", children: [_jsx("p", { children: "\u9875\u9762\u4FE1\u606F\u4E0D\u5B8C\u6574" }), _jsx(Button, { onClick: () => navigate('/'), children: "\u8FD4\u56DE\u9996\u9875" })] }));
    }
    return (_jsxs("div", { className: "booking-page", children: [_jsxs("div", { className: "booking-header", children: [_jsx(Button, { icon: _jsx(ArrowLeftOutlined, {}), onClick: () => navigate(-1), className: "back-button", children: "\u8FD4\u56DE" }), _jsx("h2", { children: "\u95E8\u7968\u9884\u8BA2" })] }), _jsxs("div", { className: "booking-content", children: [_jsx(Card, { className: "booking-info-card", title: "\u9884\u8BA2\u4FE1\u606F", children: _jsxs(Descriptions, { column: 1, children: [_jsx(Descriptions.Item, { label: "\u666F\u70B9\u540D\u79F0", children: scenicSpot.name }), _jsx(Descriptions.Item, { label: "\u95E8\u7968\u89C4\u683C", children: selectedSpec.name }), _jsxs(Descriptions.Item, { label: "\u5355\u4EF7", children: ["\u00A5", selectedSpec.price] }), _jsx(Descriptions.Item, { label: "\u89C4\u683C\u8BF4\u660E", children: selectedSpec.description })] }) }), _jsx(Card, { className: "booking-form-card", title: "\u586B\u5199\u9884\u8BA2\u4FE1\u606F", children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, className: "booking-form", children: [_jsx(Form.Item, { name: "customerName", label: "\u8054\u7CFB\u4EBA\u59D3\u540D", rules: [
                                        { required: true, message: '请输入联系人姓名' },
                                        { min: 2, message: '姓名至少2个字符' }
                                    ], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u4EBA\u59D3\u540D", size: "large" }) }), _jsx(Form.Item, { name: "customerPhone", label: "\u8054\u7CFB\u7535\u8BDD", rules: [
                                        { required: true, message: '请输入联系电话' },
                                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                                    ], children: _jsx(Input, { prefix: _jsx(PhoneOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u7535\u8BDD", size: "large" }) }), _jsx(Form.Item, { name: "customerEmail", label: "\u90AE\u7BB1\u5730\u5740\uFF08\u53EF\u9009\uFF09", rules: [
                                        { type: 'email', message: '请输入正确的邮箱地址' }
                                    ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740", size: "large" }) }), _jsx(Form.Item, { name: "visitDate", label: "\u6E38\u89C8\u65E5\u671F", rules: [
                                        { required: true, message: '请选择游览日期' }
                                    ], children: _jsx(DatePicker, { size: "large", style: { width: '100%' }, disabledDate: (current) => current && current < dayjs().startOf('day'), placeholder: "\u8BF7\u9009\u62E9\u6E38\u89C8\u65E5\u671F" }) }), _jsx(Form.Item, { name: "quantity", label: "\u8D2D\u4E70\u6570\u91CF", rules: [
                                        { required: true, message: '请输入购买数量' },
                                        { type: 'number', min: 1, max: 10, message: '数量必须在1-10之间' }
                                    ], children: _jsx(InputNumber, { min: 1, max: 10, size: "large", style: { width: '100%' }, placeholder: "\u8BF7\u8F93\u5165\u8D2D\u4E70\u6570\u91CF", onChange: () => form.validateFields(['quantity']) }) }), _jsx(Form.Item, { name: "specialRequests", label: "\u7279\u6B8A\u8981\u6C42\uFF08\u53EF\u9009\uFF09", children: _jsx(TextArea, { rows: 3, placeholder: "\u5982\u6709\u7279\u6B8A\u8981\u6C42\u8BF7\u5728\u6B64\u8BF4\u660E", maxLength: 200, showCount: true }) }), _jsxs("div", { className: "total-price", children: [_jsx("span", { className: "total-label", children: "\u603B\u4EF7\uFF1A" }), _jsxs("span", { className: "total-value", children: ["\u00A5", calculateTotal()] })] }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", size: "large", block: true, loading: submitting, className: "submit-button", children: submitting ? '提交中...' : '确认预订' }) })] }) })] })] }));
};
export default Booking;
