import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Tag, Input, DatePicker,
  Form, Select, message, Popconfirm, Row, Col
} from 'antd';
import { 
  SearchOutlined, ExportOutlined, EyeOutlined, 
  DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { orderApi } from '../../api';
import { Order } from '../../types';
import { formatDate, formatPrice } from '../../utils';
import AdminLayout from '../../components/AdminLayout';
import './OrderManagement.css';

const { RangePicker } = DatePicker;

const OrderManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [searchForm] = Form.useForm();
  
  // 获取订单列表
  const fetchOrderList = async (page = currentPage, filters = {}) => {
    try {
      setLoading(true);
      const response = await orderApi.getAll(page, pageSize, filters);
      setOrderList(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('获取订单列表失败:', error);
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const values = searchForm.getFieldsValue();
    fetchOrderList(page, values);
  };

  // 查看订单详情
  const showOrderDetail = (record: Order) => {
    setCurrentOrder(record);
    setDetailModalVisible(true);
  };

  // 处理删除订单
  const handleDelete = async (id: string) => {
    try {
      await orderApi.delete(id);
      message.success('订单删除成功');
      fetchOrderList();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 处理搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setCurrentPage(1);
    fetchOrderList(1, values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setCurrentPage(1);
    fetchOrderList(1, {});
  };

  // 导出订单数据
  const handleExport = async () => {
    try {
      message.loading('正在导出数据...');
      const values = searchForm.getFieldsValue();
      await orderApi.exportOrders(values);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    }
  };

  // 订单表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ellipsis: true,
    },
    {
      title: '景点名称',
      dataIndex: 'scenicName',
      key: 'scenicName',
    },
    {
      title: '规格',
      dataIndex: 'specName',
      key: 'specName',
    },
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '联系电话',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => showOrderDetail(record)}
            size="small"
          >
            详情
          </Button>
          <Popconfirm
            title="确定要删除这个订单吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="order-management-container">
        <div className="table-header">
          <h2>订单管理</h2>
          <Button 
            type="primary" 
            icon={<ExportOutlined />} 
            onClick={handleExport}
          >
            导出数据
          </Button>
        </div>
        
        <div className="search-form">
          <Form
            form={searchForm}
            layout="horizontal"
            onFinish={handleSearch}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="keyword" label="关键词">
                  <Input placeholder="订单号/景点名称/客户姓名" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="phone" label="联系电话">
                  <Input placeholder="客户联系电话" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="dateRange" label="创建时间">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item className="search-buttons">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={orderList} 
          rowKey="id" 
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            onChange: handlePageChange,
            showSizeChanger: false,
          }}
          scroll={{ x: 'max-content' }}
        />
        
        {/* 订单详情模态框 */}
        <Modal
          title="订单详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={600}
        >
          {currentOrder && (
            <div className="order-detail">
              <div className="detail-item">
                <span className="detail-label">订单号：</span>
                <span className="detail-value">{currentOrder.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">景点名称：</span>
                <span className="detail-value">{currentOrder.scenicName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">规格：</span>
                <span className="detail-value">{currentOrder.specName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">价格：</span>
                <span className="detail-value">{formatPrice(currentOrder.price)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">客户姓名：</span>
                <span className="detail-value">{currentOrder.customerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">联系电话：</span>
                <span className="detail-value">{currentOrder.customerPhone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">创建时间：</span>
                <span className="detail-value">{formatDate(currentOrder.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">备注：</span>
                <span className="detail-value">{currentOrder.remark || '无'}</span>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;