import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Spin, Result, message } from 'antd';
import { scenicApi, specApi, orderApi } from '../api';
import { ScenicSpot, ScenicSpec } from '../types';
import { formatPrice, isValidPhone } from '../utils';
import './BookingForm.css';

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const specId = searchParams.get('specId');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scenic, setScenic] = useState<ScenicSpot | null>(null);
  const [spec, setSpec] = useState<ScenicSpec | null>(null);
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
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, specId, navigate]);

  const handleSubmit = async (values: any) => {
    if (!scenic || !spec || !id) return;
    
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
    } catch (error) {
      console.error('提交订单失败:', error);
      message.error('提交订单失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const validatePhone = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入手机号码');
    }
    if (!isValidPhone(value)) {
      return Promise.reject('请输入有效的手机号码');
    }
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div className="loading-container container">
        <Spin size="large" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container">
        <Result
          status="success"
          title="预订成功！"
          subTitle="您的预订信息已提交，我们将尽快与您联系确认。"
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              返回首页
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (!scenic || !spec) {
    return (
      <div className="container">
        <p>未找到景点或门票信息</p>
      </div>
    );
  }

  return (
    <div className="booking-form-container container">
      <h1>填写预订信息</h1>
      
      <div className="booking-content">
        <div className="booking-summary">
          <Card title="预订详情" className="summary-card">
            <div className="summary-item">
              <span className="summary-label">景点名称：</span>
              <span className="summary-value">{scenic.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">门票类型：</span>
              <span className="summary-value">{spec.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">门票价格：</span>
              <span className="summary-value price">{formatPrice(spec.price)}</span>
            </div>
          </Card>
        </div>
        
        <div className="booking-form">
          <Card title="联系人信息">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="手机号码"
                rules={[{ validator: validatePhone }]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={submitting}
                  className="submit-button"
                >
                  确认提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;