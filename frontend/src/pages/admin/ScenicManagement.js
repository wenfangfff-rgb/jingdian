import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Upload, message, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { scenicApi, specApi } from '../../api';
import { formatDate, formatPrice } from '../../utils';
import AdminLayout from '../../components/AdminLayout';
import './ScenicManagement.css';
const { TabPane } = Tabs;
const { TextArea } = Input;
const ScenicManagement = () => {
    const [form] = Form.useForm();
    const [specForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [scenicList, setScenicList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [specModalVisible, setSpecModalVisible] = useState(false);
    const [currentScenic, setCurrentScenic] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize] = useState(10);
    const [activeTab, setActiveTab] = useState('1');
    const [specList, setSpecList] = useState([]);
    const [editingSpec, setEditingSpec] = useState(null);
    // 获取景点列表
    const fetchScenicList = async (page = currentPage) => {
        try {
            setLoading(true);
            const response = await scenicApi.getAll(page, pageSize);
            setScenicList(response.data);
            setTotal(response.total);
        }
        catch (error) {
            console.error('获取景点列表失败:', error);
            message.error('获取景点列表失败');
        }
        finally {
            setLoading(false);
        }
    };
    // 获取规格列表
    const fetchSpecList = async (scenicId) => {
        try {
            const specs = await specApi.getByScenicId(scenicId);
            setSpecList(specs);
        }
        catch (error) {
            console.error('获取规格列表失败:', error);
            message.error('获取规格列表失败');
        }
    };
    useEffect(() => {
        fetchScenicList();
    }, []);
    // 处理页码变化
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchScenicList(page);
    };
    // 打开添加/编辑景点模态框
    const showModal = (record) => {
        setCurrentScenic(record || null);
        setFileList([]);
        if (record) {
            // 编辑模式
            form.setFieldsValue({
                name: record.name,
                description: record.description,
                location: record.location,
                basePrice: record.price,
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
        }
        else {
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
                await scenicApi.update(currentScenic._id, {
                    ...values,
                    images: images.length > 0 ? images : currentScenic.images,
                });
                message.success('景点更新成功');
            }
            else {
                // 添加景点
                await scenicApi.create({
                    ...values,
                    images,
                });
                message.success('景点添加成功');
            }
            setModalVisible(false);
            fetchScenicList();
        }
        catch (error) {
            console.error('提交失败:', error);
            message.error('操作失败，请重试');
        }
    };
    // 处理删除景点
    const handleDelete = async (id) => {
        try {
            await scenicApi.delete(id);
            message.success('景点删除成功');
            fetchScenicList();
        }
        catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败，请重试');
        }
    };
    // 处理图片上传
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    // 处理规格管理
    const handleManageSpecs = (record) => {
        setCurrentScenic(record);
        fetchSpecList(record._id);
        setActiveTab('2');
    };
    // 打开添加/编辑规格模态框
    const showSpecModal = (record) => {
        setEditingSpec(record || null);
        if (record) {
            // 编辑模式
            specForm.setFieldsValue({
                name: record.name,
                price: record.price,
                description: record.description,
            });
        }
        else {
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
        if (!currentScenic)
            return;
        try {
            const values = await specForm.validateFields();
            if (editingSpec) {
                // 更新规格
                await specApi.update(editingSpec._id, values);
                message.success('规格更新成功');
            }
            else {
                // 添加规格
                const specData = {
                    ...values,
                    scenicId: currentScenic._id
                };
                await specApi.create(specData);
                message.success('规格添加成功');
            }
            setSpecModalVisible(false);
            fetchSpecList(currentScenic._id);
        }
        catch (error) {
            console.error('提交失败:', error);
            message.error('操作失败，请重试');
        }
    };
    // 处理删除规格
    const handleDeleteSpec = async (specId) => {
        if (!currentScenic)
            return;
        try {
            await specApi.delete(specId);
            message.success('规格删除成功');
            fetchSpecList(currentScenic._id);
        }
        catch (error) {
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
            render: (price) => formatPrice(price),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (_jsxs(Space, { size: "middle", children: [_jsx(Button, { type: "primary", icon: _jsx(EditOutlined, {}), onClick: () => showModal(record), size: "small", children: "\u7F16\u8F91" }), _jsx(Button, { type: "primary", onClick: () => handleManageSpecs(record), size: "small", children: "\u89C4\u683C" }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u666F\u70B9\u5417\uFF1F", onConfirm: () => handleDelete(record._id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", icon: _jsx(ExclamationCircleOutlined, { style: { color: 'red' } }), children: _jsx(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), size: "small", children: "\u5220\u9664" }) })] })),
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
            render: (price) => formatPrice(price),
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
            render: (_, record) => (_jsxs(Space, { size: "middle", children: [_jsx(Button, { type: "primary", icon: _jsx(EditOutlined, {}), onClick: () => showSpecModal(record), size: "small", children: "\u7F16\u8F91" }), _jsx(Popconfirm, { title: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u89C4\u683C\u5417\uFF1F", onConfirm: () => handleDeleteSpec(record._id), okText: "\u786E\u5B9A", cancelText: "\u53D6\u6D88", icon: _jsx(ExclamationCircleOutlined, { style: { color: 'red' } }), children: _jsx(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), size: "small", children: "\u5220\u9664" }) })] })),
        },
    ];
    return (_jsx(AdminLayout, { children: _jsxs("div", { className: "scenic-management-container", children: [_jsxs(Tabs, { activeKey: activeTab, onChange: setActiveTab, children: [_jsxs(TabPane, { tab: "\u666F\u70B9\u5217\u8868", children: [_jsxs("div", { className: "table-header", children: [_jsx("h2", { children: "\u666F\u70B9\u7BA1\u7406" }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: () => showModal(), children: "\u6DFB\u52A0\u666F\u70B9" })] }), _jsx(Table, { columns: columns, dataSource: scenicList, rowKey: "id", loading: loading, pagination: {
                                        current: currentPage,
                                        pageSize,
                                        total,
                                        onChange: handlePageChange,
                                        showSizeChanger: false,
                                    } })] }, "1"), _jsx(TabPane, { tab: "\u89C4\u683C\u7BA1\u7406", disabled: !currentScenic, children: currentScenic && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "table-header", children: [_jsxs("h2", { children: [currentScenic.name, " - \u89C4\u683C\u7BA1\u7406"] }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: () => showSpecModal(), children: "\u6DFB\u52A0\u89C4\u683C" })] }), _jsx(Table, { columns: specColumns, dataSource: specList, rowKey: "id", pagination: false })] })) }, "2")] }), _jsx(Modal, { title: currentScenic ? '编辑景点' : '添加景点', open: modalVisible, onOk: handleSubmit, onCancel: handleCancel, width: 700, children: _jsxs(Form, { form: form, layout: "vertical", children: [_jsx(Form.Item, { name: "name", label: "\u666F\u70B9\u540D\u79F0", rules: [{ required: true, message: '请输入景点名称' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u540D\u79F0" }) }), _jsx(Form.Item, { name: "location", label: "\u4F4D\u7F6E", rules: [{ required: true, message: '请输入景点位置' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u4F4D\u7F6E" }) }), _jsx(Form.Item, { name: "basePrice", label: "\u57FA\u7840\u4EF7\u683C", rules: [{ required: true, message: '请输入基础价格' }], children: _jsx(InputNumber, { min: 0, step: 0.01, precision: 2, style: { width: '100%' }, placeholder: "\u8BF7\u8F93\u5165\u57FA\u7840\u4EF7\u683C" }) }), _jsx(Form.Item, { name: "description", label: "\u666F\u70B9\u63CF\u8FF0", rules: [{ required: true, message: '请输入景点描述' }], children: _jsx(TextArea, { rows: 4, placeholder: "\u8BF7\u8F93\u5165\u666F\u70B9\u63CF\u8FF0" }) }), _jsx(Form.Item, { label: "\u666F\u70B9\u56FE\u7247", extra: "\u652F\u6301\u591A\u5F20\u56FE\u7247\u4E0A\u4F20\uFF0C\u5EFA\u8BAE\u5C3A\u5BF8 1200x800 \u50CF\u7D20", children: _jsx(Upload, { action: "/api/upload", listType: "picture-card", fileList: fileList, onChange: handleUploadChange, multiple: true, children: _jsxs("div", { children: [_jsx(PlusOutlined, {}), _jsx("div", { style: { marginTop: 8 }, children: "\u4E0A\u4F20" })] }) }) })] }) }), _jsx(Modal, { title: editingSpec ? '编辑规格' : '添加规格', open: specModalVisible, onOk: handleSpecSubmit, onCancel: handleSpecCancel, children: _jsxs(Form, { form: specForm, layout: "vertical", children: [_jsx(Form.Item, { name: "name", label: "\u89C4\u683C\u540D\u79F0", rules: [{ required: true, message: '请输入规格名称' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u89C4\u683C\u540D\u79F0\uFF0C\u5982\uFF1A\u6210\u4EBA\u7968\u3001\u513F\u7AE5\u7968" }) }), _jsx(Form.Item, { name: "price", label: "\u4EF7\u683C", rules: [{ required: true, message: '请输入价格' }], children: _jsx(InputNumber, { min: 0, step: 0.01, precision: 2, style: { width: '100%' }, placeholder: "\u8BF7\u8F93\u5165\u4EF7\u683C" }) }), _jsx(Form.Item, { name: "description", label: "\u89C4\u683C\u63CF\u8FF0", rules: [{ required: true, message: '请输入规格描述' }], children: _jsx(TextArea, { rows: 3, placeholder: "\u8BF7\u8F93\u5165\u89C4\u683C\u63CF\u8FF0\uFF0C\u5982\uFF1A\u9002\u7528\u4EBA\u7FA4\u3001\u4F7F\u7528\u8BF4\u660E\u7B49" }) })] }) })] }) }));
};
export default ScenicManagement;
