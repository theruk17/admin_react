import { useEffect, useState } from 'react'
import axios from 'axios'
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider  } from 'antd';
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
const API_URL_GROUP = 'https://drab-jade-haddock-toga.cyclic.app/admin_data'

const Brand = []

function Data() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageSize: 50
  });


  useEffect(() => {
    setLoading(true)
    axios.get(API_URL)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
  }, []);


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
          <a onClick={showModal}><EditTwoTone twoToneColor="#ffa940" /></a>
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey={record => record.mnt_id} pagination={pagination} />

      <Modal title="Edit Form" width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Divider />
        <Form>
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
                {data_group.map(item => (
                  <Select.Option key={item.mnt_id} value={item.mnt_brand}>{item.mnt_brand}</Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Model">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={4}>
              <Form.Item label="Size">
                <Select>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Refresh Rate">
                <Select>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Panel">
                <Select>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Resolution">
                <Select>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Curve" name="disabled" valuePropName="checked">
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Price">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="ราคาพร้อมเครื่อง">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status"  valuePropName="checked">
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
