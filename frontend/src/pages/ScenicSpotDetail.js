import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Image, Tag, Descriptions, Spin, message, Select } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { ScenicSpotService } from '../services/scenicSpotService';
import './ScenicSpotDetail.css';
const { Option } = Select;
const ScenicSpotDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [scenicSpot, setScenicSpot] = useState(null);
    const [selectedSpec, setSelectedSpec] = useState('');
    useEffect(() => {
        const fetchScenicSpot = async () => {
            if (!id)
                return;
            try {
                setLoading(true);
                const response = await ScenicSpotService.getDetail(id);
                setScenicSpot(response.data);
                // 默认选择第一个规格
                if (response.data.specifications && response.data.specifications.length > 0) {
                    setSelectedSpec('0');
                }
            }
            catch (error) {
                console.error('获取景点详情失败:', error);
                message.error('获取景点详情失败');
            }
            finally {
                setLoading(false);
            }
        };
        fetchScenicSpot();
    }, [id]);
    const handleBooking = () => {
        if (!selectedSpec) {
            message.warning('请选择门票规格');
            return;
        }
        navigate(`/booking/${id}?spec=${selectedSpec}`);
    };
    const getSelectedSpecification = () => {
        if (!scenicSpot || !selectedSpec)
            return null;
        const specIndex = parseInt(selectedSpec);
        return scenicSpot.specifications?.[specIndex];
    };
    if (loading) {
        return (_jsx("div", { className: "loading-container", children: _jsx(Spin, { size: "large" }) }));
    }
    if (!scenicSpot) {
        return (_jsxs("div", { className: "error-container", children: [_jsx("p", { children: "\u666F\u70B9\u4FE1\u606F\u4E0D\u5B58\u5728" }), _jsx(Button, { onClick: () => navigate('/'), children: "\u8FD4\u56DE\u9996\u9875" })] }));
    }
    const selectedSpecification = getSelectedSpecification();
    return (_jsxs("div", { className: "scenic-spot-detail", children: [_jsx("div", { className: "detail-header", children: _jsx(Button, { icon: _jsx(ArrowLeftOutlined, {}), onClick: () => navigate(-1), className: "back-button", children: "\u8FD4\u56DE" }) }), _jsxs(Row, { gutter: [24, 24], children: [_jsx(Col, { xs: 24, lg: 16, children: _jsxs(Card, { className: "detail-card", children: [_jsx("div", { className: "image-gallery", children: _jsx(Image.PreviewGroup, { children: scenicSpot.images && scenicSpot.images.length > 0 ? (scenicSpot.images.map((image, index) => (_jsx(Image, { src: image, alt: `${scenicSpot.name} - ${index + 1}`, className: "detail-image" }, index)))) : (_jsx(Image, { src: "/placeholder-image.jpg", alt: scenicSpot.name, className: "detail-image" })) }) }), _jsxs("div", { className: "detail-content", children: [_jsx("h1", { className: "spot-title", children: scenicSpot.name }), _jsxs("div", { className: "spot-tags", children: [_jsx(Tag, { color: "blue", icon: _jsx(EnvironmentOutlined, {}), children: scenicSpot.location }), _jsx(Tag, { color: "green", children: scenicSpot.category })] }), _jsxs(Descriptions, { title: "\u666F\u70B9\u4FE1\u606F", column: 1, className: "spot-descriptions", children: [_jsx(Descriptions.Item, { label: "\u666F\u70B9\u4ECB\u7ECD", children: scenicSpot.description }), _jsxs(Descriptions.Item, { label: "\u5F00\u653E\u65F6\u95F4", children: [_jsx(ClockCircleOutlined, {}), " ", scenicSpot.openingHours || '全天开放'] }), _jsxs(Descriptions.Item, { label: "\u8054\u7CFB\u7535\u8BDD", children: [_jsx(PhoneOutlined, {}), " ", scenicSpot.contactInfo || '暂无'] }), _jsx(Descriptions.Item, { label: "\u8BE6\u7EC6\u5730\u5740", children: scenicSpot.location })] })] })] }) }), _jsx(Col, { xs: 24, lg: 8, children: _jsxs(Card, { className: "booking-card", title: "\u95E8\u7968\u9884\u8BA2", children: [_jsxs("div", { className: "spec-selection", children: [_jsx("h4", { children: "\u9009\u62E9\u95E8\u7968\u89C4\u683C\uFF1A" }), _jsx(Select, { value: selectedSpec, onChange: setSelectedSpec, style: { width: '100%', marginBottom: 16 }, placeholder: "\u8BF7\u9009\u62E9\u95E8\u7968\u89C4\u683C", children: scenicSpot.specifications?.map((spec, index) => (_jsxs(Option, { value: index.toString(), children: [spec.name, " - \u00A5", spec.price] }, index))) })] }), selectedSpecification && (_jsxs("div", { className: "spec-details", children: [_jsxs("div", { className: "price-info", children: [_jsx("span", { className: "price-label", children: "\u4EF7\u683C\uFF1A" }), _jsxs("span", { className: "price-value", children: ["\u00A5", selectedSpecification.price] })] }), _jsx("div", { className: "spec-description", children: _jsx("p", { children: selectedSpecification.description }) })] })), _jsx(Button, { type: "primary", size: "large", block: true, onClick: handleBooking, className: "booking-button", children: "\u7ACB\u5373\u9884\u8BA2" })] }) })] })] }));
};
export default ScenicSpotDetail;
