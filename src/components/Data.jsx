import { useEffect, useState } from 'react'
import axios from 'axios'
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message  } from 'antd';
import {
  Row,
  Col,
  Form,
  Checkbox,
  Input,
  Select,
  Upload,
  Popconfirm,
} from 'antd';
import '../App.css'

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app/admin_data'

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
  { val: '34' },
]

const Hz = [
  { val: '60' },
  { val: '75' },
  { val: '100' },
  { val: '144' },
  { val: '165' },
  { val: '170' },
  { val: '240' },
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
  { val: 'WQHD' },
]

const Resolution = [
  { val: '1920 x 1080 (FHD)' },
  { val: '2560 x 1440 (2K)' },
  { val: '3840 x 2160 (4K)' },
  { val: '3440 x 1440 (2K)' },
]

function Data() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [pagination, setPagination] = useState({
    pageSize: 50
  });
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    setLoading(true)
    axios.get(API_URL)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
  }, []);

  const handleEdit = (id) => {
    setCurrentData(data.find(d => d.mnt_id === id));
    form.setFieldsValue({
      brand: currentData.mnt_brand,
      model: currentData.mnt_model,
      size: currentData.mnt_size,
      hz: currentData.mnt_refresh_rate,
      panel: currentData.mnt_panel,
      resolution: currentData.mnt_resolution,
      price_srp: currentData.mnt_price_srp,
      price: currentData.mnt_price_w_com,

    });
    setVisible(true);
  }

  const handleSubmit = values => {
    setIsSubmitting(true);
    axios.put('https://drab-jade-haddock-toga.cyclic.app/edit/' + currentData.mnt_id, values)
      .then(res => {
        info = () => {
          messageApi.info(res.data);
        };
        setIsSubmitting(false);
        setVisible(false);
        setData(data.map(d => d.mnt_id === currentData.mnt_id ? res.data : d));
      })
      .catch(err => {
        console.log(err);
        //.error('Error updating data');
        setIsSubmitting(false);
      });
  };


  const columns = [
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
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record.mnt_id)}><EditTwoTone twoToneColor="#ffa940" /></a>
          <Popconfirm
            title="Delete the task"
            placement="topRight"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
          >
            <a><DeleteTwoTone twoToneColor="#eb2f96" /></a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleStatusChange = (key) => {
    const newData = [...data];
    const target = newData.find((item) => item.mnt_id === key);
    if (target) {
      target.mnt_status = target.mnt_status === 'Y' ? 'N' : 'Y';
      setData(newData);
    }
  }; 

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey={record => record.mnt_id} pagination={pagination} />

      <Modal title="Edit Form" open={visible} width={1000} onOk={() => form.submit()} onCancel={() => setVisible(false)}>
      <Divider />
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Brand" name="brand"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Brand!',
                  },
                ]}>
                <Select placeholder="Brand">
                {Brand.map(item => (
                  <Select.Option key={item.val} value={currentData.brand} >{item.val}</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Model" name="model">
                <Input placeholder='Model' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={4}>
              <Form.Item label="Size" name="size">
                <Select placeholder="Size">
                {Size.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}"</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Refresh Rate" name="hz">
                <Select placeholder="Refresh Rate">
                {Hz.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val} Hz</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Panel" name="panel">
                <Select placeholder="Panel">
                {Panel.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Resolution" name="resolution">
                <Select placeholder="Resolution">
                {Resolution.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Curve" name="curve" valuePropName="checked">
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Price" name="price_srp">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="ราคาพร้อมเครื่อง" name="price">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch checkedChildren="On" unCheckedChildren="Off"/>
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
    </>
  )
}

export default Data
