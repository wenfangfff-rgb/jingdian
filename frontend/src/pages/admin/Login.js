import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import './Login.css';
const { Title } = Typography;
const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        try {
            await AuthService.login(values);
            message.success('登录成功');
            navigate('/admin/dashboard');
        }
        catch (error) {
            message.error(error.response?.data?.error || '登录失败');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "admin-login-container", children: _jsxs(Card, { className: "login-card", children: [_jsx("div", { className: "login-header", children: _jsx("h1", { children: "\u7BA1\u7406\u5458\u767B\u5F55" }) }), _jsxs(Form, { layout: "vertical", onFinish: onFinish, requiredMark: false, children: [_jsx(Form.Item, { name: "username", label: "\u7528\u6237\u540D", rules: [{ required: true, message: '请输入用户名' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D" }) }), _jsx(Form.Item, { name: "password", label: "\u5BC6\u7801", rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input.Password, { placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, loading: loading, className: "login-button", children: "\u767B\u5F55" }) })] })] }) }));
};
export default AdminLogin;
