import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Descriptions,
  message,
  Popconfirm
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { OrderService, Order, OrderQuery } from '../../services/orderService';
import './Orders.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminOrders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editForm] = Form.useForm();

  // 订单状态选项
  const statusOptions = [
    { label: '待确认', value: 'pending', color: 'orange' },
    { label: '已确认', value: 'confirmed', color: 'green' },
    { label: '已取消', value: 'cancelled', color: 'red' },
    { label: '已完成', value: 'completed', color: 'blue' }
  ];

  // 支付状态选项
  const paymentStatusOptions = [
    { label: '未支付', value: 'unpaid', color: 'orange' },
    { label: '已支付', value: 'paid', color: 'green' },
    { label: '已退款', value: 'refunded', color: 'red' }
  ];

  // 加载订单列表
  const loadOrders = async (params?: OrderQuery) => {
    setLoading(true);
    try {
      const response = await OrderService.getList({
        page: pagination.current,
        limit: pagination.pageSize,
        ...params
      });
      setOrders(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      message.error('加载订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 处理表格分页
  const handleTableChange = (paginationConfig: any) => {
    setPagination(prev => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    }));
    loadOrders();
  };

  // 搜索订单
  const handleSearch = (values: any) => {
    const params: OrderQuery = {};
    
    if (values.search) {
      params.search = values.search;
    }
    if (values.status) {
      params.status = values.status;
    }
    if (values.paymentStatus) {
      params.paymentStatus = values.paymentStatus;
    }
    if (values.dateRange && values.dateRange.length === 2) {
      params.startDate = values.dateRange[0].format('YYYY-MM-DD');
      params.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    setPagination(prev => ({ ...prev, current: 1 }));
    loadOrders(params);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    loadOrders();
  };

  // 查看订单详情
  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  // 编辑订单状态
  const showEditModal = (order: Order) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes
    });
    setEditVisible(true);
  };

  // 更新订单状态
  const handleUpdateOrder = async (values: any) => {
    if (!selectedOrder) return;
    
    try {
      await OrderService.updateStatus(selectedOrder.id, values);
      message.success('订单状态更新成功');
      setEditVisible(false);
      loadOrders();
    } catch (error: any) {
      message.error(error.response?.data?.error || '更新失败');
    }
  };

  // 删除订单
  const handleDeleteOrder = async (id: string) => {
    try {
      await OrderService.delete(id);
      message.success('订单删除成功');
      loadOrders();
    } catch (error: any) {
      message.error(error.response?.data?.error || '删除失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string, options: any[]) => {
    const option = options.find(opt => opt.value === status);
    return option ? (
      <Tag color={option.color}>{option.label}</Tag>
    ) : status;
  };

  // 表格列定义
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
    },
    {
      title: '景点名称',
      dataIndex: 'scenicSpotName',
      key: 'scenicSpotName',
      width: 150,
    },
    {
      title: '客户信息',
      key: 'customer',
      width: 150,
      render: (_, record: Order) => (
        <div>
          <div>{record.customerInfo.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.customerInfo.phone}
          </div>
        </div>
      )
    },
    {
      title: '规格',
      dataIndex: ['specification', 'name'],
      key: 'specification',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '游览日期',
      dataIndex: 'visitDate',
      key: 'visitDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status, statusOptions)
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => getStatusTag(status, paymentStatusOptions)
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_, record: Order) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个订单吗？"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="admin-orders">
      <Card>
        <div className="page-header">
          <h2>订单管理</h2>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadOrders()}
          >
            刷新
          </Button>
        </div>

        {/* 搜索表单 */}
        <Card size="small" className="search-card">
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="search">
              <Input
                placeholder="搜索订单号、客户姓名或电话"
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="status">
              <Select
                placeholder="订单状态"
                style={{ width: 120 }}
                allowClear
              >
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="paymentStatus">
              <Select
                placeholder="支付状态"
                style={{ width: 120 }}
                allowClear
              >
                {paymentStatusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dateRange">
              <RangePicker placeholder={['开始日期', '结束日期']} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="订单号" span={2}>
              {selectedOrder.orderNumber}
            </Descriptions.Item>
            <Descriptions.Item label="景点名称">
              {selectedOrder.scenicSpotName}
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {selectedOrder.specification.name}
            </Descriptions.Item>
            <Descriptions.Item label="单价">
              ¥{selectedOrder.specification.price}
            </Descriptions.Item>
            <Descriptions.Item label="数量">
              {selectedOrder.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="总金额" span={2}>
              ¥{selectedOrder.totalAmount}
            </Descriptions.Item>
            <Descriptions.Item label="客户姓名">
              {selectedOrder.customerInfo.name}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {selectedOrder.customerInfo.phone}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {selectedOrder.customerInfo.email || '未填写'}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">
              {selectedOrder.customerInfo.idCard || '未填写'}
            </Descriptions.Item>
            <Descriptions.Item label="游览日期">
              {new Date(selectedOrder.visitDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {getStatusTag(selectedOrder.status, statusOptions)}
            </Descriptions.Item>
            <Descriptions.Item label="支付状态">
              {getStatusTag(selectedOrder.paymentStatus, paymentStatusOptions)}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {selectedOrder.notes || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑订单模态框 */}
      <Modal
        title="编辑订单状态"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateOrder}
        >
          <Form.Item
            name="status"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select placeholder="请选择订单状态">
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="paymentStatus"
            label="支付状态"
            rules={[{ required: true, message: '请选择支付状态' }]}
          >
            <Select placeholder="请选择支付状态">
              {paymentStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                更新
              </Button>
              <Button onClick={() => setEditVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrders;