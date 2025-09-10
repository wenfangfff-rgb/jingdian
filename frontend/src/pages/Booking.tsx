import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, DatePicker, InputNumber, Button, Spin, message, Descriptions } from 'antd';
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { ScenicSpotService, ScenicSpot } from '../services/scenicSpotService';
import { OrderService } from '../services/orderService';
import dayjs from 'dayjs';
import './Booking.css';

const { TextArea } = Input;

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  visitDate: dayjs.Dayjs;
  quantity: number;
  specialRequests?: string;
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const specId = searchParams.get('spec');
  
  const [form] = Form.useForm<BookingFormData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [scenicSpot, setScenicSpot] = useState<ScenicSpot | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<any>(null);

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
        const spec = spot.specifications?.find(s => s.id === specId);
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
      } catch (error) {
        console.error('获取景点信息失败:', error);
        message.error('获取景点信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, specId, navigate, form]);

  const handleSubmit = async (values: BookingFormData) => {
    if (!scenicSpot || !selectedSpec) return;
    
    try {
      setSubmitting(true);
      
      const orderData = {
        scenicSpotId: scenicSpot.id,
        specificationId: selectedSpec.id,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        visitDate: values.visitDate.format('YYYY-MM-DD'),
        quantity: values.quantity,
        totalPrice: selectedSpec.price * values.quantity,
        specialRequests: values.specialRequests
      };
      
      const response = await OrderService.create(orderData);
      
      message.success('预订成功！');
      navigate(`/order-success/${response.data.id}`);
    } catch (error) {
      console.error('提交订单失败:', error);
      message.error('提交订单失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const quantity = form.getFieldValue('quantity') || 1;
    return selectedSpec ? selectedSpec.price * quantity : 0;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!scenicSpot || !selectedSpec) {
    return (
      <div className="error-container">
        <p>页面信息不完整</p>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          返回
        </Button>
        <h2>门票预订</h2>
      </div>

      <div className="booking-content">
        <Card className="booking-info-card" title="预订信息">
          <Descriptions column={1}>
            <Descriptions.Item label="景点名称">{scenicSpot.name}</Descriptions.Item>
            <Descriptions.Item label="门票规格">{selectedSpec.name}</Descriptions.Item>
            <Descriptions.Item label="单价">¥{selectedSpec.price}</Descriptions.Item>
            <Descriptions.Item label="规格说明">{selectedSpec.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="booking-form-card" title="填写预订信息">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="booking-form"
          >
            <Form.Item
              name="customerName"
              label="联系人姓名"
              rules={[
                { required: true, message: '请输入联系人姓名' },
                { min: 2, message: '姓名至少2个字符' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入联系人姓名" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="请输入联系电话" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="邮箱地址（可选）"
              rules={[
                { type: 'email', message: '请输入正确的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="请输入邮箱地址" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="visitDate"
              label="游览日期"
              rules={[
                { required: true, message: '请选择游览日期' }
              ]}
            >
              <DatePicker 
                size="large" 
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder="请选择游览日期"
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="购买数量"
              rules={[
                { required: true, message: '请输入购买数量' },
                { type: 'number', min: 1, max: 10, message: '数量必须在1-10之间' }
              ]}
            >
              <InputNumber 
                min={1} 
                max={10} 
                size="large" 
                style={{ width: '100%' }}
                placeholder="请输入购买数量"
                onChange={() => form.validateFields(['quantity'])}
              />
            </Form.Item>

            <Form.Item
              name="specialRequests"
              label="特殊要求（可选）"
            >
              <TextArea 
                rows={3} 
                placeholder="如有特殊要求请在此说明"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <div className="total-price">
              <span className="total-label">总价：</span>
              <span className="total-value">¥{calculateTotal()}</span>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block
                loading={submitting}
                className="submit-button"
              >
                {submitting ? '提交中...' : '确认预订'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Booking;