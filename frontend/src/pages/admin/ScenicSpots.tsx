import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Tag,
  Image,
  Popconfirm,
  Card,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ScenicSpotService, ScenicSpot } from '../../services/scenicSpotService';
import './ScenicSpots.css';

const { Option } = Select;
const { TextArea } = Input;

interface ScenicSpotFormData {
  name: string;
  description: string;
  location: string;
  price: number;
  category: string;
  specifications: {
    name: string;
    price: number;
    description: string;
  }[];
  features: string[];
  openingHours: string;
  contactInfo: string;
  status: 'active' | 'inactive';
}

const AdminScenicSpots: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [spots, setSpots] = useState<ScenicSpot[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSpot, setEditingSpot] = useState<ScenicSpot | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 景点分类选项
  const categoryOptions = [
    { label: '自然风光', value: '自然风光' },
    { label: '历史文化', value: '历史文化' },
    { label: '主题乐园', value: '主题乐园' },
    { label: '城市观光', value: '城市观光' },
    { label: '温泉度假', value: '温泉度假' },
    { label: '海滨海岛', value: '海滨海岛' }
  ];

  // 加载景点列表
  const loadSpots = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await ScenicSpotService.getList({
        page,
        limit: pageSize
      });
      setSpots(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.total
      });
    } catch (error) {
      message.error('加载景点列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpots();
  }, []);

  // 处理表格分页
  const handleTableChange = (paginationConfig: any) => {
    loadSpots(paginationConfig.current, paginationConfig.pageSize);
  };

  // 打开新增/编辑模态框
  const openModal = (spot?: ScenicSpot) => {
    setEditingSpot(spot || null);
    setModalVisible(true);
    
    if (spot) {
      form.setFieldsValue({
        ...spot,
        features: spot.features.join(','),
        specifications: spot.specifications
      });
      // 设置已有图片
      const existingFiles = spot.images.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: 'done',
        url
      }));
      setFileList(existingFiles);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setEditingSpot(null);
    form.resetFields();
    setFileList([]);
  };

  // 提交表单
  const handleSubmit = async (values: ScenicSpotFormData) => {
    try {
      const formData = new FormData();
      
      // 添加基本信息
      Object.keys(values).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(values.features.split(',')));
        } else if (key === 'specifications') {
          formData.append(key, JSON.stringify(values.specifications));
        } else {
          formData.append(key, values[key as keyof ScenicSpotFormData] as string);
        }
      });
      
      // 添加图片文件
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });
      
      if (editingSpot) {
        await ScenicSpotService.update(editingSpot.id, formData);
        message.success('景点更新成功');
      } else {
        await ScenicSpotService.create(formData);
        message.success('景点创建成功');
      }
      
      closeModal();
      loadSpots(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    }
  };

  // 删除景点
  const handleDelete = async (id: string) => {
    try {
      await ScenicSpotService.delete(id);
      message.success('景点删除成功');
      loadSpots(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error.response?.data?.error || '删除失败');
    }
  };

  // 图片上传处理
  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  // 图片预览
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // 获取base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '景点名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => <Tag color="blue">{category}</Tag>
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '基础价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '预订数',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      width: 80,
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images: string[]) => (
        images.length > 0 ? (
          <Image
            width={50}
            height={50}
            src={images[0]}
            style={{ objectFit: 'cover' }}
          />
        ) : '无图片'
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: ScenicSpot) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openModal(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个景点吗？"
            onConfirm={() => handleDelete(record.id)}
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
    <div className="admin-scenic-spots">
      <Card>
        <div className="page-header">
          <h2>景点管理</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新增景点
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={spots}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingSpot ? '编辑景点' : '新增景点'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="景点名称"
                rules={[{ required: true, message: '请输入景点名称' }]}
              >
                <Input placeholder="请输入景点名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="景点分类"
                rules={[{ required: true, message: '请选择景点分类' }]}
              >
                <Select placeholder="请选择景点分类">
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="景点位置"
                rules={[{ required: true, message: '请输入景点位置' }]}
              >
                <Input placeholder="请输入景点位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="基础价格"
                rules={[{ required: true, message: '请输入基础价格' }]}
              >
                <Input type="number" placeholder="请输入基础价格" addonBefore="¥" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="景点描述"
            rules={[{ required: true, message: '请输入景点描述' }]}
          >
            <TextArea rows={4} placeholder="请输入景点描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="openingHours"
                label="开放时间"
                rules={[{ required: true, message: '请输入开放时间' }]}
              >
                <Input placeholder="例如：8:00-18:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactInfo"
                label="联系方式"
                rules={[{ required: true, message: '请输入联系方式' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features"
            label="景点特色"
            rules={[{ required: true, message: '请输入景点特色' }]}
          >
            <Input placeholder="请用逗号分隔多个特色，例如：山水风光,历史悠久,文化底蕴" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item label="景点图片">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onPreview={handlePreview}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSpot ? '更新' : '创建'}
              </Button>
              <Button onClick={closeModal}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览模态框 */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminScenicSpots;