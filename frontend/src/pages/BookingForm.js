import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Spin, Result, message } from 'antd';
import { scenicApi, specApi, orderApi } from '../api';
import { formatPrice, isValidPhone } from '../utils';
import './BookingForm.css';
const BookingForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const specId = searchParams.get('specId');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [scenic, setScenic] = useState(null);
    const [spec, setSpec] = useState(null);
    const [form] = Form.useForm();
    useEffect(() => {
        const fetchData = async () => {
            if (!id || !specId) {
                message.error('缺少必要参数');
                navigate('/');
                return;
            }
            try {
                setLoading(true);
                const scenicData = await scenicApi.getById(id);
                setScenic(scenicData);
                const specsData = await specApi.getByScenicId(id);
                const selectedSpec = specsData.find(s => s._id === specId);
                if (!selectedSpec) {
                    message.error('未找到所选门票类型');
                    navigate(`/scenic/${id}`);
                    return;
                }
                setSpec(selectedSpec);
            }
            catch (error) {
                console.error('获取数据失败:', error);
                message.error('获取数据失败，请稍后重试');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, specId, navigate]);
    const handleSubmit = async (values) => {
        if (!scenic || !spec || !id)
            return;
        try {
            setSubmitting(true);
            await orderApi.create({
                scenicId: id,
                scenicName: scenic.name,
                specId: spec._id,
                specName: spec.name,
                price: spec.price,
                customerName: values.name,
                customerPhone: values.phone,
                status: 'pending'
            });
            setSubmitted(true);
        }
        catch (error) {
            console.error('提交订单失败:', error);
            message.error('提交订单失败，请稍后重试');
        }
        finally {
            setSubmitting(false);
        }
    };
    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject('请输入手机号码');
        }
        if (!isValidPhone(value)) {
            return Promise.reject('请输入有效的手机号码');
        }
        return Promise.resolve();
    };
    if (loading) {
        return (_jsx("div", { className: "loading-container container", children: _jsx(Spin, { size: "large" }) }));
    }
    if (submitted) {
        return (_jsx("div", { className: "container", children: _jsx(Result, { status: "success", title: "\u9884\u8BA2\u6210\u529F\uFF01", subTitle: "\u60A8\u7684\u9884\u8BA2\u4FE1\u606F\u5DF2\u63D0\u4EA4\uFF0C\u6211\u4EEC\u5C06\u5C3D\u5FEB\u4E0E\u60A8\u8054\u7CFB\u786E\u8BA4\u3002", extra: [
                    _jsx(Button, { type: "primary", onClick: () => navigate('/'), children: "\u8FD4\u56DE\u9996\u9875" }, "home"),
                ] }) }));
    }
    if (!scenic || !spec) {
        return (_jsx("div", { className: "container", children: _jsx("p", { children: "\u672A\u627E\u5230\u666F\u70B9\u6216\u95E8\u7968\u4FE1\u606F" }) }));
    }
    return (_jsxs("div", { className: "booking-form-container container", children: [_jsx("h1", { children: "\u586B\u5199\u9884\u8BA2\u4FE1\u606F" }), _jsxs("div", { className: "booking-content", children: [_jsx("div", { className: "booking-summary", children: _jsxs(Card, { title: "\u9884\u8BA2\u8BE6\u60C5", className: "summary-card", children: [_jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "\u666F\u70B9\u540D\u79F0\uFF1A" }), _jsx("span", { className: "summary-value", children: scenic.name })] }), _jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "\u95E8\u7968\u7C7B\u578B\uFF1A" }), _jsx("span", { className: "summary-value", children: spec.name })] }), _jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "\u95E8\u7968\u4EF7\u683C\uFF1A" }), _jsx("span", { className: "summary-value price", children: formatPrice(spec.price) })] })] }) }), _jsx("div", { className: "booking-form", children: _jsx(Card, { title: "\u8054\u7CFB\u4EBA\u4FE1\u606F", children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, requiredMark: false, children: [_jsx(Form.Item, { name: "name", label: "\u59D3\u540D", rules: [{ required: true, message: '请输入姓名' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D" }) }), _jsx(Form.Item, { name: "phone", label: "\u624B\u673A\u53F7\u7801", rules: [{ validator: validatePhone }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, size: "large", loading: submitting, className: "submit-button", children: "\u786E\u8BA4\u63D0\u4EA4" }) })] }) }) })] })] }));
};
export default BookingForm;
