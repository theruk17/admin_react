import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import '../App.css';

const API_URL = 'https://d1hcfk5kl1j97j.cloudfront.net';

const Brand = [
  { text: 'AMD', value: 'AMD' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'CORSAIR', value: 'CORSAIR' },
  { text: 'GALAX', value: 'GALAX' },
  { text: 'IHAVECPU', value: 'IHAVECPU' },
  { text: 'JAK', value: 'JAK' },
  { text: 'LOGA', value: 'LOGA' },
  { text: 'LOGITECH', value: 'LOGITECH' },
  { text: 'MELGEEK', value: 'MELGEEK' },
  { text: 'PNY', value: 'PNY' },
  { text: 'PULSAR', value: 'PULSAR' },
  { text: 'ROCCAT', value: 'ROCCAT' },
]


const Color = [
  { text: 'BLACk', value: 'BLACK' },
  { text: 'WHITE', value: 'WHITE' },
  { text: 'RED', value: 'RED' },
  { text: 'GREEN', value: 'GREEN' },
  { text: 'BLUE', value: 'BLUE' },
  { text: 'PINK', value: 'PINK' },
  { text: 'YELLOW', value: 'YELLOW' },
  { text: 'MAGENTA', value: 'MAGENTA' },
  { text: 'CANVAS', value: 'CANVAS' },
  { text: 'CHRISTIAN', value: 'CHRISTIAN' },
  { text: 'PALETTE', value: 'PALETTE' },
]

const Type = [
  { text: '970x350x4 mm', value: '970x350x4 mm' },
  { text: '930x400x4mm', value: '930x400x4mm' },
  { text: '900x400x3mm', value: '900x400x3mm' },
  { text: '850x400x4mm', value: '850x400x4mm' },
  { text: '490x420x3mm', value: '490x420x3mm' },
  { text: '450x400mm', value: '450x400mm' },
  { text: '360x260x2mm', value: '360x260x2mm' },
  { text: '320x270x4mm', value: '320x270x4mm' },
]

const Group = [
  { text: 'MOUSE PAD', value: 'MOUSE PAD' },
  { text: 'MOUSE FEET', value: 'MOUSE FEET' },
]

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const EditForm = ({ visible, onCreate, onCancel, record }) => {
  const [form] = Form.useForm();
  const [switchValue, setSwitchValue] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setSwitchValue(record.mp_status === "Y")
    setFileList([{ url: record.mp_img }])
    form.setFieldsValue({
      color: record.mp_color,
      group: record.mp_group,
      dimentions: record.mp_dimentions,
      brand: record.mp_brand,
      model: record.mp_model,
      price_srp: record.mp_price_srp,
      discount: record.mp_discount,
      href: record.mp_href,
      status: record.mp_status,
    });
  }, [record, form]);


  const onStatusChange = (checked) => {
    setSwitchValue(checked);
    form.setFieldsValue({ status: checked ? 'Y' : 'N' });
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleUpload = ({ file, onSuccess, onError, onProgress }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mvoujdcp');

    try {
      axios.post('https://api.cloudinary.com/v1_1/drllzqbk0/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent });
        }
      })
        .then(res => {
          console.log(res);
          const imageUrl = res.data.secure_url;
          message.success("Upload Image to Cloud Server " + res.statusText);
          onSuccess(imageUrl);
          axios.put(API_URL + '/update_img_mp/' + record.mp_id, { imageUrl })
            .then(res => {
              message.success(res.data);
            })

        })

    } catch (error) {
      console.error(error);
      message.error('Image upload failed!');
      onError();
    }
  };
  const uploadButton = (
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
  );

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
      <Form form={form} name="formp_in_mpodal">
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
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Model" >
              <Input placeholder='Model' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Color" allowClear>
                {Color.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Dimentions" name="dimentions">
              <Select placeholder="Dimentions" allowClear>
                {Type.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price SRP" name="price_srp">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Discount" name="discount">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Status" name="status">
              <Switch checkedChildren="On" unCheckedChildren="Off" checked={switchValue} onChange={onStatusChange} ></Switch>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item name="href" label="Link" >
              <Input placeholder='Link' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Upload Image">
          <Upload listType="picture-card"
            fileList={fileList}
            customRequest={handleUpload}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const FanData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 100
  });

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL + "/admin_data_mp")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
      .put(API_URL + "/update_stock_mp")
      .then((res) => {
        message.success(res.data);
      })
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
      .delete(API_URL + `/admin_del_mp/${id}`)
      .then(res => {
        setData(data.filter(item => item.mp_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_mp/' + record.mp_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL + '/admin_data_mp')
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
    const target = newData.find((item) => item.mp_id === key);
    if (target) {
      target.mp_status = target.mp_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status_mp/' + key, { status: target.mp_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL + '/admin_data_mp')
            .then(res => {
              setData(res.data);
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
  };

  const Column = [

    {
      title: 'Image',
      dataIndex: 'mp_img',
      key: 'mp_img',
      width: 60,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'mp_brand', key: 'mp_brand', width: 100,
      render: (text, record) => <a href={record.mp_href} target='_blank'>{text}</a>,

      filters: Brand,
      onFilter: (value, record) => record.mp_brand.indexOf(value) === 0,
      sorter: (a, b) => a.mp_brand.localeCompare(b.mp_brand),
      sortDirections: ['descend'],

    },
    {
      title: 'Model', dataIndex: 'mp_model', key: 'mp_model',
    },

    {
      title: 'Color', dataIndex: 'mp_color', key: 'mp_color', align: 'center',
    },
    {
      title: 'Group', dataIndex: 'mp_group', key: 'mp_group', align: 'center',
      filters: Group,
      onFilter: (value, record) => record.mp_group.indexOf(value) === 0,
    },
    {
      title: 'Dimentions', dataIndex: 'mp_dimentions', key: 'mp_dimentions', align: 'center',
      filters: Type,
      onFilter: (value, record) => record.mp_dimentions.indexOf(value) === 0,
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'mp_stock_nny', key: 'mp_stock_nny', align: 'center',
          sorter: (a, b) => a.mp_stock_nny - b.mp_stock_nny,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รามอินทรา', dataIndex: 'mp_stock_ramintra', key: 'mp_stock_ramintra', align: 'center',
          sorter: (a, b) => a.mp_stock_ramintra - b.mp_stock_ramintra,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'บางพลัด', dataIndex: 'mp_stock_bangphlat', key: 'mp_stock_bangphlat', align: 'center',
          sorter: (a, b) => a.mp_stock_bangphlat - b.mp_stock_bangphlat,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'เดอะโฟล์ท', dataIndex: 'mp_stock_thefloat', key: 'mp_stock_thefloat', align: 'center',
          sorter: (a, b) => a.mp_stock_thefloat - b.mp_stock_thefloat,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รังสิต', dataIndex: 'mp_stock_rangsit', key: 'mp_stock_rangsit', align: 'center',
          sorter: (a, b) => a.mp_stock_rangsit - b.mp_stock_rangsit,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รวม', dataIndex: 'mp_stock_sum', key: 'mp_stock_sum', align: 'center', sorter: (a, b) => a.mp_stock_sum - b.mp_stock_sum,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
      ]
    },

    {
      title: 'Price SRP', dataIndex: 'mp_price_srp', key: 'mp_price_srp', align: 'right',
      sorter: (a, b) => a.mp_price_srp - b.mp_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Discount', dataIndex: 'mp_discount', key: 'mp_discount', align: 'right',
      sorter: (a, b) => a.mp_discount - b.mp_discount,
      render: (value) => (
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'mp_status', key: 'mp_status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.mp_status === 'Y'} onChange={() => handleStatusChange(record.mp_id)}
        />
      )
    },
    {
      title: 'Action', dataIndex: 'action', key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a key={record} onClick={() => showModal(record)}><EditTwoTone twoToneColor="#ffa940" /></a>
          <Popconfirm
            title="Delete the item"
            onConfirm={() => handleDelete(record.mp_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.mp_id} pagination={pagination} onChange={onChange} bordered size="small"

      ></Table>
      <EditForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        record={record}
      />
    </div>
  );
};

export default FanData;