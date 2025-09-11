import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, message, Empty, Tag } from 'antd';
import { SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import { OrderService } from '../services/orderService';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './OrderQuery.css';

interface OrderQueryForm {
  orderNumber?: string;
  customerPhone?: string;
}

interface OrderInfo {
  id: string;
  orderNumber: string;
  scenicSpotName: string;
  specificationName: string;
  customerName: string;
  customerPhone: string;
  visitDate: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const OrderQuery: React.FC = () => {
  const [form] = Form.useForm<OrderQueryForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (values: OrderQueryForm) => {
    if (!values.orderNumber && !values.customerPhone) {
      message.warning('请输入订单号或手机号进行查询');
      return;
    }

    try {
      setLoading(true);
      let orders: OrderInfo[] = [];
      
      if (values.orderNumber) {
        const response = await OrderService.searchByOrderNumber(values.orderNumber);
        orders = [response.data as any];
      } else {
        // 如果只有手机号，使用getList方法搜索
        const response = await OrderService.getList({ search: values.customerPhone });
        orders = response.data as any;
      }
      
      setOrders(orders);
      setSearched(true);
      
      if (orders.length === 0) {
        message.info('未找到相关订单');
      }
    } catch (error) {
      console.error('查询订单失败:', error);
      message.error('查询订单失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'orange',
      'confirmed': 'green',
      'cancelled': 'red',
      'completed': 'blue'
    };
    return colorMap[status] || 'default';
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

  const columns: ColumnsType<OrderInfo> = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      render: (text) => (
        <span className="order-number">{text}</span>
      )
    },
    {
      title: '景点名称',
      dataIndex: 'scenicSpotName',
      key: 'scenicSpotName',
      width: 200
    },
    {
      title: '门票规格',
      dataIndex: 'specificationName',
      key: 'specificationName',
      width: 150
    },
    {
      title: '联系人',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100
    },
    {
      title: '游览日期',
      dataIndex: 'visitDate',
      key: 'visitDate',
      width: 120,
      render: (date) => dayjs(date).format('MM-DD')
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity) => `${quantity}张`
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      render: (price) => (
        <span className="price">¥{price}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('MM-DD HH:mm')
    }
  ];

  return (
    <div className="order-query-page">
      <div className="page-header">
        <h2>订单查询</h2>
        <p>请输入订单号或预订时的手机号进行查询</p>
      </div>

      <Card className="search-card">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          className="search-form"
        >
          <Form.Item
            name="orderNumber"
            className="search-item"
          >
            <Input
              placeholder="请输入订单号"
              prefix={<SearchOutlined />}
              size="large"
              style={{ width: 250 }}
            />
          </Form.Item>

          <Form.Item className="search-divider">
            <span>或</span>
          </Form.Item>

          <Form.Item
            name="customerPhone"
            className="search-item"
          >
            <Input
              placeholder="请输入预订手机号"
              prefix={<PhoneOutlined />}
              size="large"
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SearchOutlined />}
            >
              查询订单
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {searched && (
        <Card className="result-card" title="查询结果">
          {orders.length > 0 ? (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 1200 }}
            />
          ) : (
            <Empty
              description="未找到相关订单"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <p>请检查输入信息是否正确，或联系客服：400-123-4567</p>
            </Empty>
          )}
        </Card>
      )}

      <Card className="help-card" title="查询帮助">
        <div className="help-content">
          <h4>查询方式：</h4>
          <ul>
            <li>方式一：输入完整的订单号进行查询</li>
            <li>方式二：输入预订时使用的手机号查询该号码下的所有订单</li>
          </ul>
          
          <h4>订单状态说明：</h4>
          <ul>
            <li><Tag color="orange">待确认</Tag> - 订单已提交，等待确认</li>
            <li><Tag color="green">已确认</Tag> - 订单已确认，可正常使用</li>
            <li><Tag color="blue">已完成</Tag> - 已完成游览</li>
            <li><Tag color="red">已取消</Tag> - 订单已取消</li>
          </ul>
          
          <h4>联系我们：</h4>
          <p>如有疑问，请联系客服热线：<strong>400-123-4567</strong></p>
          <p>服务时间：每天 9:00 - 18:00</p>
        </div>
      </Card>
    </div>
  );
};

export default OrderQuery;