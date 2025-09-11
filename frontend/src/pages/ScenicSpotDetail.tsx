import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Image, Tag, Descriptions, Spin, message, Select } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { ScenicSpotService, ScenicSpot } from '../services/scenicSpotService';
import './ScenicSpotDetail.css';

const { Option } = Select;

const ScenicSpotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [scenicSpot, setScenicSpot] = useState<ScenicSpot | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<string>('');

  useEffect(() => {
    const fetchScenicSpot = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await ScenicSpotService.getDetail(id);
        setScenicSpot(response.data);
        // 默认选择第一个规格
        if (response.data.specifications && response.data.specifications.length > 0) {
          setSelectedSpec('0');
        }
      } catch (error) {
        console.error('获取景点详情失败:', error);
        message.error('获取景点详情失败');
      } finally {
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
    if (!scenicSpot || !selectedSpec) return null;
    const specIndex = parseInt(selectedSpec);
    return scenicSpot.specifications?.[specIndex];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!scenicSpot) {
    return (
      <div className="error-container">
        <p>景点信息不存在</p>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  const selectedSpecification = getSelectedSpecification();

  return (
    <div className="scenic-spot-detail">
      <div className="detail-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          返回
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="detail-card">
            <div className="image-gallery">
              <Image.PreviewGroup>
                {scenicSpot.images && scenicSpot.images.length > 0 ? (
                  scenicSpot.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${scenicSpot.name} - ${index + 1}`}
                      className="detail-image"
                    />
                  ))
                ) : (
                  <Image
                    src="/placeholder-image.jpg"
                    alt={scenicSpot.name}
                    className="detail-image"
                  />
                )}
              </Image.PreviewGroup>
            </div>

            <div className="detail-content">
              <h1 className="spot-title">{scenicSpot.name}</h1>
              
              <div className="spot-tags">
                <Tag color="blue" icon={<EnvironmentOutlined />}>
                  {scenicSpot.location}
                </Tag>
                <Tag color="green">{scenicSpot.category}</Tag>

              </div>

              <Descriptions title="景点信息" column={1} className="spot-descriptions">
                <Descriptions.Item label="景点介绍">
                  {scenicSpot.description}
                </Descriptions.Item>
                <Descriptions.Item label="开放时间">
                  <ClockCircleOutlined /> {scenicSpot.openingHours || '全天开放'}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  <PhoneOutlined /> {scenicSpot.contactInfo || '暂无'}
                </Descriptions.Item>
                <Descriptions.Item label="详细地址">
                  {scenicSpot.location}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="booking-card" title="门票预订">
            <div className="spec-selection">
              <h4>选择门票规格：</h4>
              <Select
                value={selectedSpec}
                onChange={setSelectedSpec}
                style={{ width: '100%', marginBottom: 16 }}
                placeholder="请选择门票规格"
              >
                {scenicSpot.specifications?.map((spec, index) => (
                  <Option key={index} value={index.toString()}>
                    {spec.name} - ¥{spec.price}
                  </Option>
                ))}
              </Select>
            </div>

            {selectedSpecification && (
              <div className="spec-details">
                <div className="price-info">
                  <span className="price-label">价格：</span>
                  <span className="price-value">¥{selectedSpecification.price}</span>
                </div>
                <div className="spec-description">
                  <p>{selectedSpecification.description}</p>
                </div>
              </div>
            )}

            <Button 
              type="primary" 
              size="large" 
              block 
              onClick={handleBooking}
              className="booking-button"
            >
              立即预订
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ScenicSpotDetail;