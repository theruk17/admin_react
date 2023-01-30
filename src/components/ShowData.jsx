import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import {
  Space, Table, Switch, Modal, Divider, message, Spin, Row, Button,
  Col,
  Form,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Upload,
  Popconfirm,
} from 'antd';

import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app/admin_data';

const Brand = [
  { val: 'AOC' },
  { val: 'MSI' },
  { val: 'LENOVO' },
  { val: 'LG' },
  { val: 'DELL' },
  { val: 'ASUS' },
  { val: 'BENQ' },
  { val: 'ACER' },
  { val: 'SAMSUNG' },
  { val: 'GIGABYTE' },
  { val: 'COOLER MASTER' }
]

const Size = [
  { val: '21.5' },
  { val: '23.8' },
  { val: '23.6' },
  { val: '24' },
  { val: '24.5' },
  { val: '27' },
  { val: '28' },
  { val: '31.5' },
  { val: '32' },
  { val: '34' }
]

const Hz = [
  { val: '60' },
  { val: '75' },
  { val: '100' },
  { val: '144' },
  { val: '165' },
  { val: '170' },
  { val: '240' }
]

const Panel = [
  { val: 'VA' },
  { val: 'IPS' },
  { val: 'TN' },
  { val: 'SS IPS' },
  { val: 'IPS HDR' },
  { val: 'ULTRA-IPS' },
  { val: 'IPS FLAT' },
  { val: 'NANO IPS HDR' },
  { val: 'WQHD' }
]

const Resolution = [
  { val: '1920 x 1080 (FHD)' },
  { val: '2560 x 1440 (2K)' },
  { val: '3840 x 2160 (4K)' },
  { val: '3440 x 1440 (2K)' }
]

const Group = [
  { val: '21.5" 75Hz' },
  { val: '24" 75Hz - 100Hz' },
  { val: '24" 144Hz' },
  { val: '24" 165Hz' },
  { val: '27" 75Hz' },
  { val: '27" 75Hz 2K' },
  { val: '27" 144Hz' },
  { val: '27" 165Hz - 170Hz' },
  { val: '27" 240Hz' },
  { val: '27" 165Hz 2K' },
  { val: '27" - 28" 60Hz 4K' },
  { val: '31.5" 75Hz - 165Hz' },
  { val: '31.5" 75Hz 2K' },
  { val: '32" 144Hz - 165Hz 2K' },
  { val: '32" 240Hz 4K' },
  { val: '34" 144Hz 2K' }
]

const EditForm = ({ visible, onCreate, onCancel, record }) => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);

  useEffect(() => {
    setChecked(record.mnt_curve === "Y")
    setSwitchValue(record.mnt_status === "Y")
    form.setFieldsValue({
      group: record.mnt_group,
      brand: record.mnt_brand,
      model: record.mnt_model,
      size: record.mnt_size,
      hz: record.mnt_refresh_rate,
      panel: record.mnt_panel,
      resolution: record.mnt_resolution,
      price_srp: record.mnt_price_srp,
      price_w_com: record.mnt_price_w_com,
      curve: record.mnt_curve,
      status: record.mnt_status,
    });
  }, [record, form]);


  const onCheckboxChange = (e) => {
    setChecked(e.target.checked);
    form.setFieldsValue({ curve: e.target.checked  ? 'Y' : 'N'});
  };

  const onStatusChange = (checked) => {
    setSwitchValue(checked);
    form.setFieldsValue({ status: checked ? 'Y' : 'N' });
  };

  return (
    <Modal
      open={visible}
      width={1000}
      title="Edit Data"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Divider />
      <Form form={form} name="form_in_modal">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand"
              rules={[
                {
                  required: true,
                  message: 'Please input your Brand!',
                },
              ]}>
              <Select placeholder="Brand" allowClear>
                {Brand.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Model" >
              <Input placeholder='Model' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={4}>
            <Form.Item label="Size" name="size">
              <Select placeholder="Size" allowClear>
                {Size.map(item => (
                  <Select.Option key={item.val} value={item.mnt_val}>{item.val}"</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Refresh Rate" name="hz">
              <Select placeholder="Refresh Rate" allowClear>
                {Hz.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val} Hz</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Panel" name="panel">
              <Select placeholder="Panel" allowClear  >
                {Panel.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Resolution" name="resolution">
              <Select placeholder="Resolution" allowClear >
                {Resolution.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Curve" name="curve" >
              <Checkbox checked={ checked  } onChange={onCheckboxChange} ></Checkbox>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price" name="price_srp">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="ราคาพร้อมเครื่อง" name="price_w_com">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Status" name="status">
          <Switch checkedChildren="On" unCheckedChildren="Off" checked={switchValue} onChange={onStatusChange} ></Switch>
        </Form.Item>
        <Form.Item label="Upload Image" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ShowData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 50
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
  }, []);

  const showModal = (record) => {
    setVisible(true);
    setRecord(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = id => {
    axios
      .delete(`https://drab-jade-haddock-toga.cyclic.app/admin_del/${id}`)
      .then(res => {
        setData(data.filter(item => item.mnt_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put('https://drab-jade-haddock-toga.cyclic.app/edit/' + record.mnt_id, values)
      .then(res => {
        message.success(res.data);
        axios.get('https://drab-jade-haddock-toga.cyclic.app/admin_data')
          .then(res => {
            setData(res.data);
            setVisible(false);
          })
          .catch(err => {
            console.log(err);
            message.error("Error fetching updated data");
          })
      })
      .catch(err => {
        console.log(err);
        message.error('Error updating data');
      });
  };
  
  


  const handleStatusChange = (key) => {
    const newData = [...data];
    const target = newData.find((item) => item.mnt_id === key);
    if (target) {
      target.mnt_status = target.mnt_status === 'Y' ? 'N' : 'Y';
      setData(newData);
    };
  };

  const Column = [
    {
      title: 'Image',
      dataIndex: 'mnt_img',
      key: 'mnt_img',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" width="30" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'mnt_brand', key: 'mnt_brand',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Model', dataIndex: 'mnt_model', key: 'mnt_model',
    },
    {
      title: 'Size', dataIndex: 'mnt_size', key: 'mnt_size',
      render: (text) => <p>{text}"</p>,
    },
    {
      title: 'Refresh Rate', dataIndex: 'mnt_refresh_rate', key: 'mnt_refresh_rate',
      render: (text) => <p>{text}Hz</p>,
    },
    {
      title: 'Panel', dataIndex: 'mnt_panel', key: 'mnt_panel',
    },
    {
      title: 'Resolution', dataIndex: 'mnt_resolution', key: 'mnt_resolution',
    },
    {
      title: 'Curve', dataIndex: 'mnt_curve', key: 'mnt_curve',
    },
    {
      title: 'Status', dataIndex: 'mnt_status', key: 'mnt_status',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.mnt_status === 'Y'} onChange={() => handleStatusChange(record.mnt_id)}
        />
      )
    },
    {
      title: 'Price SRP', dataIndex: 'mnt_price_srp', key: 'mnt_price_srp',
      render: (value) => (
        <NumericFormat value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'ซื้อพร้อมเครื่อง', dataIndex: 'mnt_price_w_com', key: 'mnt_price_w_com',
      render: (value) => (
        <NumericFormat value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },

    {
      title: 'Action', dataIndex: 'action', key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a key={record} onClick={() => showModal(record)}><EditTwoTone twoToneColor="#ffa940" /></a>
          <Popconfirm
            title="Delete the item"
            onConfirm={() => handleDelete(record.mnt_id)}
            placement="topRight"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
          >
            <a><DeleteTwoTone twoToneColor="#eb2f96" /></a>
          </Popconfirm>
        </Space>
      )
    },
  ]
  return (
    <div>
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.mnt_id} pagination={pagination}></Table>
      <EditForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        record={record}
      />
    </div>
  );
};

export default ShowData;