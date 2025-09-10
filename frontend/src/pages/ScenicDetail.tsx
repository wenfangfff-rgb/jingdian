import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Radio, Spin, Image, message } from 'antd';
import { scenicApi, specApi } from '../api';
import { ScenicSpot, ScenicSpec } from '../types';
import { formatPrice } from '../utils';
import './ScenicDetail.css';

const ScenicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [scenic, setScenic] = useState<ScenicSpot | null>(null);
  const [specs, setSpecs] = useState<ScenicSpec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('');

  useEffect(() => {
    const fetchScenicDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const scenicData = await scenicApi.getById(id);
        setScenic(scenicData);
        
        const specsData = await specApi.getByScenicId(id);
        setSpecs(specsData);
        
        if (specsData.length > 0) {
          setSelectedSpec(specsData[0]._id);
        }
      } catch (error) {
        console.error('获取景点详情失败:', error);
        message.error('获取景点详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchScenicDetail();
  }, [id]);

  const handleSpecChange = (e: any) => {
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
    return (
      <div className="loading-container container">
        <Spin size="large" />
      </div>
    );
  }

  if (!scenic) {
    return (
      <div className="container">
        <p>未找到景点信息</p>
      </div>
    );
  }

  return (
    <div className="scenic-detail-container container">
      <div className="scenic-header">
        <h1>{scenic.name}</h1>
        <p className="scenic-location">{scenic.location}</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <div className="scenic-images">
            <Image.PreviewGroup>
              {scenic.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${scenic.name} - 图片 ${index + 1}`}
                  className="scenic-image"
                />
              ))}
            </Image.PreviewGroup>
          </div>

          <div className="scenic-description">
            <h2>景点介绍</h2>
            <p>{scenic.description}</p>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <Card className="booking-card">
            <h2>选择门票</h2>
            
            {specs.length > 0 ? (
              <>
                <div className="spec-selection">
                  <Radio.Group onChange={handleSpecChange} value={selectedSpec}>
                    {specs.map((spec) => (
                      <div key={spec._id} className="spec-option">
                        <Radio value={spec._id}>
                          <div className="spec-info">
                            <span className="spec-name">{spec.name}</span>
                            <span className="spec-price">{formatPrice(spec.price)}</span>
                          </div>
                          {spec.description && (
                            <p className="spec-description">{spec.description}</p>
                          )}
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
                
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={handleBooking}
                  className="booking-button"
                >
                  立即预订
                </Button>
              </>
            ) : (
              <p>暂无可用门票</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ScenicDetail;