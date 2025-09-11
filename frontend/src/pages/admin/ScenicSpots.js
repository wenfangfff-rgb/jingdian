import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Image, Popconfirm, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { ScenicSpotService } from '../../services/scenicSpotService';
import './ScenicSpots.css';
const { Option } = Select;
const { TextArea } = Input;
const AdminScenicSpots = () => {
    const [loading, setLoading] = useState(false);
    const [spots, setSpots] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSpot, setEditingSpot] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
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
        }
        catch (error) {
            message.error('加载景点列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadSpots();
    }, []);
    // 处理表格分页
    const handleTableChange = (paginationConfig) => {
        loadSpots(paginationConfig.current, paginationConfig.pageSize);
    };
    // 打开新增/编辑模态框
    const openModal = (spot) => {
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
        }
        else {
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
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            // 添加基本信息
            Object.keys(values).forEach(key => {
                if (key === 'features') {
                    formData.append(key, JSON.stringify(values.features));
                }
                else if (key === 'specifications') {
                    formData.append(key, JSON.stringify(values.specifications));
                }
                else {
                    formData.append(key, values[key]);
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
            }
            else {
                await ScenicSpotService.create(formData);
                message.success('景点创建成功');
            }
            closeModal();
            loadSpots(pagination.current, pagination.pageSize);
        }
        catch (error) {
            message.error(error.response?.data?.error || '操作失败');
        }
    };
    // 删除景点
    const handleDelete = async (id) => {
        try {
            await ScenicSpotService.delete(id);
            message.success('景点删除成功');
            loadSpots(pagination.current, pagination.pageSize);
        }
        catch (error) {
            message.error(error.response?.data?.error || '删除失败');
        }
    };
    // 图片上传处理
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    // 图片预览
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };
    // 获取base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
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
            render: (category) => _jsx(Tag, { color: "blue", children: category })
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
            render: (price) => `¥${price}`
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => (_jsx(Tag, { color: status === 'active' ? 'green' : 'red', children: status === 'active' ? '启用' : '禁用' }))
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
            render: (images) => (images.length > 0 ? (_jsx(Image, { width: 50, height: 50, src: images[0], style: { objectFit: 'cover' } })) : '无图片')
        },
        {
            title: '操作',
            key: 'actions',
            width: 150,
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "link", icon: _jsx(EyeOutlined, {}), onClick: () => openModal(record), children: "\u67E5\u770B" }), _jsx(Button, { type: "link", icon: _jsx(EditOutlined, {}), onClick: () => openModal(record), children: "\u7F16\u8F91" }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u666F\u70B9\u5417\uFF1F", onConfirm: () => handleDelete(record.id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", children: _jsx(Button, { type: "link", danger: true, icon: _jsx(DeleteOutlined, {}), children: "\u5220\u9664" }) })] }))
        }
    ];
    return (_jsxs("div", { className: "admin-scenic-spots", children: [_jsxs(Card, { children: [_jsxs("div", { className: "page-header", children: [_jsx("h2", { children: "\u666F\u70B9\u7BA1\u7406" }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: () => openModal(), children: "\u65B0\u589E\u666F\u70B9" })] }), _jsx(Table, { columns: columns, dataSource: spots, rowKey: "id", loading: loading, pagination: {
                            ...pagination,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条记录`
                        }, onChange: handleTableChange, scroll: { x: 1200 } })] }), _jsx(Modal, { title: editingSpot ? '编辑景点' : '新增景点', open: modalVisible, onCancel: closeModal, footer: null, width: 800, destroyOnClose: true, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, children: [_jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "name", label: "\u666F\u70B9\u540D\u79F0", rules: [{ required: true, message: '请输入景点名称' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u540D\u79F0" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "category", label: "\u666F\u70B9\u5206\u7C7B", rules: [{ required: true, message: '请选择景点分类' }], children: _jsx(Select, { placeholder: "\u8BF7\u9009\u62E9\u666F\u70B9\u5206\u7C7B", children: categoryOptions.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }) }) })] }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "location", label: "\u666F\u70B9\u4F4D\u7F6E", rules: [{ required: true, message: '请输入景点位置' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u4F4D\u7F6E" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "price", label: "\u57FA\u7840\u4EF7\u683C", rules: [{ required: true, message: '请输入基础价格' }], children: _jsx(Input, { type: "number", placeholder: "\u8BF7\u8F93\u5165\u57FA\u7840\u4EF7\u683C", addonBefore: "\u00A5" }) }) })] }), _jsx(Form.Item, { name: "description", label: "\u666F\u70B9\u63CF\u8FF0", rules: [{ required: true, message: '请输入景点描述' }], children: _jsx(TextArea, { rows: 4, placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u63CF\u8FF0" }) }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "openingHours", label: "\u5F00\u653E\u65F6\u95F4", rules: [{ required: true, message: '请输入开放时间' }], children: _jsx(Input, { placeholder: "\u4F8B\u5982\uFF1A8:00-18:00" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "contactInfo", label: "\u8054\u7CFB\u65B9\u5F0F", rules: [{ required: true, message: '请输入联系方式' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u7535\u8BDD" }) }) })] }), _jsx(Form.Item, { name: "features", label: "\u666F\u70B9\u7279\u8272", rules: [{ required: true, message: '请输入景点特色' }], children: _jsx(Input, { placeholder: "\u8BF7\u7528\u9017\u53F7\u5206\u9694\u591A\u4E2A\u7279\u8272\uFF0C\u4F8B\u5982\uFF1A\u5C71\u6C34\u98CE\u5149,\u5386\u53F2\u60A0\u4E45,\u6587\u5316\u5E95\u8574" }) }), _jsx(Form.Item, { name: "status", label: "\u72B6\u6001", rules: [{ required: true, message: '请选择状态' }], children: _jsxs(Select, { placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001", children: [_jsx(Option, { value: "active", children: "\u542F\u7528" }), _jsx(Option, { value: "inactive", children: "\u7981\u7528" })] }) }), _jsx(Form.Item, { label: "\u666F\u70B9\u56FE\u7247", children: _jsx(Upload, { listType: "picture-card", fileList: fileList, onChange: handleUploadChange, onPreview: handlePreview, beforeUpload: () => false, multiple: true, children: fileList.length >= 8 ? null : (_jsxs("div", { children: [_jsx(UploadOutlined, {}), _jsx("div", { style: { marginTop: 8 }, children: "\u4E0A\u4F20\u56FE\u7247" })] })) }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: editingSpot ? '更新' : '创建' }), _jsx(Button, { onClick: closeModal, children: "\u53D6\u6D88" })] }) })] }) }), _jsx(Modal, { open: previewVisible, title: "\u56FE\u7247\u9884\u89C8", footer: null, onCancel: () => setPreviewVisible(false), children: _jsx("img", { alt: "preview", style: { width: '100%' }, src: previewImage }) })] }));
};
export default AdminScenicSpots;
