import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, Select, Spin, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ScenicSpotService, ScenicSpot } from '../services/scenicSpotService';
import './Home.css';

const { Meta } = Card;

const { Search } = Input;
const { Option } = Select;

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [spots, setSpots] = useState<ScenicSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<ScenicSpot[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
      } catch (error) {
        console.error('获取景点数据失败:', error);
        message.error('获取景点数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    filterSpots(value, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterSpots(searchKeyword, category);
  };

  const filterSpots = (keyword: string, category: string) => {
    let filtered = spots;
    
    if (keyword) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(keyword.toLowerCase()) ||
        spot.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(spot => spot.category === category);
    }
    
    setFilteredSpots(filtered);
  };

  const formatPrice = (price: number) => {
    return `¥${price}`;
  };

  return (
    <div className="home-container container">
      <div className="banner">
        <div className="banner-content">
          <h1>探索精彩景点</h1>
          <p>发现令人难忘的旅行目的地</p>
        </div>
      </div>

      <div className="scenic-list">
        <h2 className="section-title">热门景点</h2>
        
        <div className="search-filters">
          <Row gutter={[16, 16]} className="filter-row">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索景点名称或描述"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="选择景点类型"
                size="large"
                style={{ width: '100%' }}
                allowClear
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredSpots.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {filteredSpots.map((scenic) => (
                <Col xs={24} sm={12} md={8} lg={6} key={scenic._id}>
                  <Link to={`/scenic/${scenic._id}`}>
                    <Card
                      hoverable
                      className="scenic-card"
                      cover={
                        <div className="card-image-container">
                          <img 
                            alt={scenic.name} 
                            src={scenic.images[0] || '/placeholder.jpg'} 
                            className="card-image"
                          />
                        </div>
                      }
                    >
                      <Meta 
                        title={scenic.name} 
                        description={
                          <div className="card-description">
                            <p className="card-location">{scenic.location}</p>
                            <p className="card-price">{formatPrice(scenic.price)}起</p>
                          </div>
                        } 
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
            
            <div className="pagination-container">
              <Pagination 
                current={pagination.current} 
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无景点信息" />
        )}
      </div>
    </div>
  );
};

export default Home;