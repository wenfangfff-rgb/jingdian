import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Spin, message, Pagination, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ScenicSpotService } from '../services/scenicSpotService';
import './Home.css';
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;
const Home = () => {
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const categories = [
        '自然风光',
        '历史文化',
        '主题乐园',
        '城市观光',
        '温泉度假',
        '海滨海岛'
    ];
    useEffect(() => {
        const fetchSpots = async () => {
            try {
                setLoading(true);
                const response = await ScenicSpotService.getList({ limit: 50 });
                setSpots(response.data);
                setFilteredSpots(response.data);
            }
            catch (error) {
                console.error('获取景点数据失败:', error);
                message.error('获取景点数据失败');
            }
            finally {
                setLoading(false);
            }
        };
        fetchSpots();
    }, []);
    const handleSearch = (value) => {
        setSearchKeyword(value);
        filterSpots(value, selectedCategory);
    };
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filterSpots(searchKeyword, category);
    };
    const filterSpots = (keyword, category) => {
        let filtered = spots;
        if (keyword) {
            filtered = filtered.filter(spot => spot.name.toLowerCase().includes(keyword.toLowerCase()) ||
                spot.description.toLowerCase().includes(keyword.toLowerCase()));
        }
        if (category) {
            filtered = filtered.filter(spot => spot.category === category);
        }
        setFilteredSpots(filtered);
    };
    const formatPrice = (price) => {
        return `¥${price}`;
    };
    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize || prev.pageSize
        }));
    };
    // 获取当前页显示的数据
    const getCurrentPageData = () => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredSpots.slice(startIndex, endIndex);
    };
    // 更新分页总数
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            total: filteredSpots.length,
            current: 1
        }));
    }, [filteredSpots]);
    return (_jsxs("div", { className: "home-container container", children: [_jsx("div", { className: "banner", children: _jsxs("div", { className: "banner-content", children: [_jsx("h1", { children: "\u63A2\u7D22\u7CBE\u5F69\u666F\u70B9" }), _jsx("p", { children: "\u53D1\u73B0\u4EE4\u4EBA\u96BE\u5FD8\u7684\u65C5\u884C\u76EE\u7684\u5730" })] }) }), _jsxs("div", { className: "scenic-list", children: [_jsx("h2", { className: "section-title", children: "\u70ED\u95E8\u666F\u70B9" }), _jsx("div", { className: "search-filters", children: _jsxs(Row, { gutter: [16, 16], className: "filter-row", children: [_jsx(Col, { xs: 24, sm: 12, md: 8, children: _jsx(Search, { placeholder: "\u641C\u7D22\u666F\u70B9\u540D\u79F0\u6216\u63CF\u8FF0", allowClear: true, enterButton: _jsx(SearchOutlined, {}), size: "large", onSearch: handleSearch, onChange: (e) => handleSearch(e.target.value) }) }), _jsx(Col, { xs: 24, sm: 12, md: 8, children: _jsx(Select, { placeholder: "\u9009\u62E9\u666F\u70B9\u7C7B\u578B", size: "large", style: { width: '100%' }, allowClear: true, onChange: handleCategoryChange, children: categories.map(category => (_jsx(Option, { value: category, children: category }, category))) }) })] }) }), loading ? (_jsx("div", { className: "loading-container", children: _jsx(Spin, { size: "large" }) })) : filteredSpots.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Row, { gutter: [24, 24], children: getCurrentPageData().map((scenic) => (_jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsx(Link, { to: `/scenic/${scenic.id}`, children: _jsx(Card, { hoverable: true, className: "scenic-card", cover: _jsx("div", { className: "card-image-container", children: _jsx("img", { alt: scenic.name, src: scenic.images[0] || '/placeholder.jpg', className: "card-image" }) }), children: _jsx(Meta, { title: scenic.name, description: _jsxs("div", { className: "card-description", children: [_jsx("p", { className: "card-location", children: scenic.location }), _jsxs("p", { className: "card-price", children: [formatPrice(scenic.price), "\u8D77"] })] }) }) }) }) }, scenic.id))) }), _jsx("div", { className: "pagination-container", children: _jsx(Pagination, { current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: handlePageChange, showSizeChanger: false }) })] })) : (_jsx(Empty, { description: "\u6682\u65E0\u666F\u70B9\u4FE1\u606F" }))] })] }));
};
export default Home;
