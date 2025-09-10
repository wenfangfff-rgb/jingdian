import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, InputNumber, 
  Upload, message, Popconfirm, Tabs, Spin, Select
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, 
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { scenicApi } from '../../api';
import { ScenicSpot, ScenicSpec } from '../../types';
import { formatDate, formatPrice } from '../../utils';
import AdminLayout from '../../components/AdminLayout';
import './ScenicManagement.css';

const { TabPane } = Tabs;
const { TextArea } = Input;

const ScenicManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [specForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [scenicList, setScenicList] = useState<ScenicSpot[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [specModalVisible, setSpecModalVisible] = useState<boolean>(false);
  const [currentScenic, setCurrentScenic] = useState<ScenicSpot | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [specList, setSpecList] = useState<ScenicSpec[]>([]);
  const [editingSpec, setEditingSpec] = useState<ScenicSpec | null>(null);

  // 获取景点列表
  const fetchScenicList = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await scenicApi.getAll(page, pageSize);
      setScenicList(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('获取景点列表失败:', error);
      message.error('获取景点列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取规格列表
  const fetchSpecList = async (scenicId: string) => {
    try {
      const specs = await scenicApi.getSpecs(scenicId);
      setSpecList(specs);
    } catch (error) {
      console.error('获取规格列表失败:', error);
      message.error('获取规格列表失败');
    }
  };

  useEffect(() => {
    fetchScenicList();
  }, []);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchScenicList(page);
  };

  // 打开添加/编辑景点模态框
  const showModal = (record?: ScenicSpot) => {
    setCurrentScenic(record || null);
    setFileList([]);
    
    if (record) {
      // 编辑模式
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        location: record.location,
        basePrice: record.basePrice,
      });
      
      // 如果有图片，设置文件列表
      if (record.images && record.images.length > 0) {
        const files = record.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url,
        }));
        setFileList(files);
      }
    } else {
      // 添加模式
      form.resetFields();
    }
    
    setModalVisible(true);
  };

  // 处理模态框取消
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // 处理景点表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理图片上传
      const images = fileList
        .filter(file => file.status === 'done' && file.response)
        .map(file => file.response.url);
      
      if (currentScenic) {
        // 更新景点
        await scenicApi.update(currentScenic.id, {
          ...values,
          images: images.length > 0 ? images : currentScenic.images,
        });
        message.success('景点更新成功');
      } else {
        // 添加景点
        await scenicApi.create({
          ...values,
          images,
        });
        message.success('景点添加成功');
      }
      
      setModalVisible(false);
      fetchScenicList();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 处理删除景点
  const handleDelete = async (id: string) => {
    try {
      await scenicApi.delete(id);
      message.success('景点删除成功');
      fetchScenicList();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 处理图片上传
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 处理规格管理
  const handleManageSpecs = (record: ScenicSpot) => {
    setCurrentScenic(record);
    fetchSpecList(record.id);
    setActiveTab('2');
  };

  // 打开添加/编辑规格模态框
  const showSpecModal = (record?: ScenicSpec) => {
    setEditingSpec(record || null);
    
    if (record) {
      // 编辑模式
      specForm.setFieldsValue({
        name: record.name,
        price: record.price,
        description: record.description,
      });
    } else {
      // 添加模式
      specForm.resetFields();
    }
    
    setSpecModalVisible(true);
  };

  // 处理规格模态框取消
  const handleSpecCancel = () => {
    setSpecModalVisible(false);
    specForm.resetFields();
  };

  // 处理规格表单提交
  const handleSpecSubmit = async () => {
    if (!currentScenic) return;
    
    try {
      const values = await specForm.validateFields();
      
      if (editingSpec) {
        // 更新规格
        await scenicApi.updateSpec(currentScenic.id, editingSpec.id, values);
        message.success('规格更新成功');
      } else {
        // 添加规格
        await scenicApi.createSpec(currentScenic.id, values);
        message.success('规格添加成功');
      }
      
      setSpecModalVisible(false);
      fetchSpecList(currentScenic.id);
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 处理删除规格
  const handleDeleteSpec = async (specId: string) => {
    if (!currentScenic) return;
    
    try {
      await scenicApi.deleteSpec(currentScenic.id, specId);
      message.success('规格删除成功');
      fetchSpecList(currentScenic.id);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    }
  };

  // 景点表格列定义
  const columns = [
    {
      title: '景点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '基础价格',
      dataIndex: 'basePrice',
      key: 'basePrice',
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
      render: (_: any, record: ScenicSpot) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Button 
            type="primary" 
            onClick={() => handleManageSpecs(record)}
            size="small"
          >
            规格
          </Button>
          <Popconfirm
            title="确定要删除这个景点吗？"
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

  // 规格表格列定义
  const specColumns = [
    {
      title: '规格名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ScenicSpec) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showSpecModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个规格吗？"
            onConfirm={() => handleDeleteSpec(record.id)}
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
      <div className="scenic-management-container">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="景点列表" key="1">
            <div className="table-header">
              <h2>景点管理</h2>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()}
              >
                添加景点
              </Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={scenicList} 
              rowKey="id" 
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize,
                total,
                onChange: handlePageChange,
                showSizeChanger: false,
              }}
            />
          </TabPane>
          
          <TabPane tab="规格管理" key="2" disabled={!currentScenic}>
            {currentScenic && (
              <>
                <div className="table-header">
                  <h2>{currentScenic.name} - 规格管理</h2>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showSpecModal()}
                  >
                    添加规格
                  </Button>
                </div>
                
                <Table 
                  columns={specColumns} 
                  dataSource={specList} 
                  rowKey="id" 
                  pagination={false}
                />
              </>
            )}
          </TabPane>
        </Tabs>
        
        {/* 景点表单模态框 */}
        <Modal
          title={currentScenic ? '编辑景点' : '添加景点'}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="景点名称"
              rules={[{ required: true, message: '请输入景点名称' }]}
            >
              <Input placeholder="请输入景点名称" />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="位置"
              rules={[{ required: true, message: '请输入景点位置' }]}
            >
              <Input placeholder="请输入景点位置" />
            </Form.Item>
            
            <Form.Item
              name="basePrice"
              label="基础价格"
              rules={[{ required: true, message: '请输入基础价格' }]}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                precision={2}
                style={{ width: '100%' }}
                placeholder="请输入基础价格"
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="景点描述"
              rules={[{ required: true, message: '请输入景点描述' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="请输入景点描述"
              />
            </Form.Item>
            
            <Form.Item
              label="景点图片"
              extra="支持多张图片上传，建议尺寸 1200x800 像素"
            >
              <Upload
                action="/api/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        
        {/* 规格表单模态框 */}
        <Modal
          title={editingSpec ? '编辑规格' : '添加规格'}
          open={specModalVisible}
          onOk={handleSpecSubmit}
          onCancel={handleSpecCancel}
        >
          <Form
            form={specForm}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="规格名称"
              rules={[{ required: true, message: '请输入规格名称' }]}
            >
              <Input placeholder="请输入规格名称，如：成人票、儿童票" />
            </Form.Item>
            
            <Form.Item
              name="price"
              label="价格"
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                precision={2}
                style={{ width: '100%' }}
                placeholder="请输入价格"
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="规格描述"
              rules={[{ required: true, message: '请输入规格描述' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="请输入规格描述，如：适用人群、使用说明等"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ScenicManagement;