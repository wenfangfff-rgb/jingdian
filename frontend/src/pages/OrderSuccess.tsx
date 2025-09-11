import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Result, Descriptions, Spin, message } from 'antd';
import { CheckCircleOutlined, HomeOutlined, CopyOutlined } from '@ant-design/icons';
import { OrderService } from '../services/orderService';
import dayjs from 'dayjs';
import './OrderSuccess.css';

interface OrderDetail {
  id: string;
  orderNumber: string;
  scenicSpotName: string;
  specificationName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  visitDate: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  specialRequests?: string;
}

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        message.error('订单ID不存在');
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        const response = await OrderService.getDetail(orderId);
        // 转换Order类型到OrderDetail类型
        const orderData = response.data;
        const orderDetail: OrderDetail = {
          id: orderData.id,
          orderNumber: orderData.orderNumber,
          scenicSpotName: orderData.scenicSpotName,
          specificationName: orderData.specification.name,
          customerName: orderData.customerInfo.name,
          customerPhone: orderData.customerInfo.phone,
          customerEmail: orderData.customerInfo.email,
          visitDate: orderData.visitDate,
          quantity: orderData.quantity,
          totalPrice: orderData.totalAmount,
          status: orderData.status,
          createdAt: orderData.createdAt,
          specialRequests: orderData.notes
        };
        setOrder(orderDetail);
      } catch (error) {
        console.error('获取订单详情失败:', error);
        message.error('获取订单详情失败');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      message.success('订单号已复制到剪贴板');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': '待确认',
      'confirmed': '已确认',
      'cancelled': '已取消',
      'completed': '已完成'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <Result
          status="error"
          title="订单信息获取失败"
          subTitle="请检查订单号是否正确或稍后重试"
          extra={[
            <Button type="primary" onClick={() => navigate('/')} key="home">
              返回首页
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        status="success"
        title="预订成功！"
        subTitle="您的门票预订已提交成功，我们会尽快为您确认订单。"
        className="success-result"
      />

      <Card className="order-detail-card" title="订单详情">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="订单号">
            <span className="order-number">{order.orderNumber}</span>
            <Button 
              type="link" 
              icon={<CopyOutlined />} 
              onClick={copyOrderNumber}
              size="small"
            >
              复制
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="景点名称">{order.scenicSpotName}</Descriptions.Item>
          <Descriptions.Item label="门票规格">{order.specificationName}</Descriptions.Item>
          <Descriptions.Item label="联系人">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{order.customerPhone}</Descriptions.Item>
          {order.customerEmail && (
            <Descriptions.Item label="邮箱">{order.customerEmail}</Descriptions.Item>
          )}
          <Descriptions.Item label="游览日期">
            {dayjs(order.visitDate).format('YYYY年MM月DD日')}
          </Descriptions.Item>
          <Descriptions.Item label="购买数量">{order.quantity} 张</Descriptions.Item>
          <Descriptions.Item label="订单金额">
            <span className="total-price">¥{order.totalPrice}</span>
          </Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <span className={`status status-${order.status}`}>
              {getStatusText(order.status)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          {order.specialRequests && (
            <Descriptions.Item label="特殊要求">{order.specialRequests}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card className="notice-card" title="温馨提示">
        <div className="notice-content">
          <p>• 请保存好您的订单号，以便查询和使用</p>
          <p>• 我们会在24小时内确认您的订单</p>
          <p>• 如有疑问，请联系客服：400-123-4567</p>
          <p>• 请在游览当日携带有效身份证件</p>
          <p>• 门票一经确认，不支持退改</p>
        </div>
      </Card>

      <div className="action-buttons">
        <Button 
          type="primary" 
          icon={<HomeOutlined />} 
          size="large"
          onClick={() => navigate('/')}
          className="home-button"
        >
          返回首页
        </Button>
        <Button 
          size="large"
          onClick={() => navigate('/order-query')}
          className="query-button"
        >
          查询订单
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;