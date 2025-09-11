import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Radio, Spin, Image, message } from 'antd';
import { scenicApi, specApi } from '../api';
import { formatPrice } from '../utils';
import './ScenicDetail.css';
const ScenicDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [scenic, setScenic] = useState(null);
    const [specs, setSpecs] = useState([]);
    const [selectedSpec, setSelectedSpec] = useState('');
    useEffect(() => {
        const fetchScenicDetail = async () => {
            if (!id)
                return;
            try {
                setLoading(true);
                const scenicData = await scenicApi.getById(id);
                setScenic(scenicData);
                const specsData = await specApi.getByScenicId(id);
                setSpecs(specsData);
                if (specsData.length > 0) {
                    setSelectedSpec(specsData[0]._id);
                }
            }
            catch (error) {
                console.error('获取景点详情失败:', error);
                message.error('获取景点详情失败，请稍后重试');
            }
            finally {
                setLoading(false);
            }
        };
        fetchScenicDetail();
    }, [id]);
    const handleSpecChange = (e) => {
        setSelectedSpec(e.target.value);
    };
    const handleBooking = () => {
        if (!selectedSpec) {
            message.warning('请选择门票类型');
            return;
        }
        navigate(`/booking/${id}?specId=${selectedSpec}`);
    };
    if (loading) {
        return (_jsx("div", { className: "loading-container container", children: _jsx(Spin, { size: "large" }) }));
    }
    if (!scenic) {
        return (_jsx("div", { className: "container", children: _jsx("p", { children: "\u672A\u627E\u5230\u666F\u70B9\u4FE1\u606F" }) }));
    }
    return (_jsxs("div", { className: "scenic-detail-container container", children: [_jsxs("div", { className: "scenic-header", children: [_jsx("h1", { children: scenic.name }), _jsx("p", { className: "scenic-location", children: scenic.location })] }), _jsxs(Row, { gutter: [24, 24], children: [_jsxs(Col, { xs: 24, md: 16, children: [_jsx("div", { className: "scenic-images", children: _jsx(Image.PreviewGroup, { children: scenic.images.map((image, index) => (_jsx(Image, { src: image, alt: `${scenic.name} - 图片 ${index + 1}`, className: "scenic-image" }, index))) }) }), _jsxs("div", { className: "scenic-description", children: [_jsx("h2", { children: "\u666F\u70B9\u4ECB\u7ECD" }), _jsx("p", { children: scenic.description })] })] }), _jsx(Col, { xs: 24, md: 8, children: _jsxs(Card, { className: "booking-card", children: [_jsx("h2", { children: "\u9009\u62E9\u95E8\u7968" }), specs.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "spec-selection", children: _jsx(Radio.Group, { onChange: handleSpecChange, value: selectedSpec, children: specs.map((spec) => (_jsx("div", { className: "spec-option", children: _jsxs(Radio, { value: spec._id, children: [_jsxs("div", { className: "spec-info", children: [_jsx("span", { className: "spec-name", children: spec.name }), _jsx("span", { className: "spec-price", children: formatPrice(spec.price) })] }), spec.description && (_jsx("p", { className: "spec-description", children: spec.description }))] }) }, spec._id))) }) }), _jsx(Button, { type: "primary", size: "large", block: true, onClick: handleBooking, className: "booking-button", children: "\u7ACB\u5373\u9884\u8BA2" })] })) : (_jsx("p", { children: "\u6682\u65E0\u53EF\u7528\u95E8\u7968" }))] }) })] })] }));
};
export default ScenicDetail;
