import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app';

const Brand = [
  { text: 'ANITECH', value: 'ANITECH' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'CORSAIR', value: 'CORSAIR' },
  { text: 'GALAX', value: 'GALAX' },
  { text: 'HyperX', value: 'HyperX' },
  { text: 'LOGA', value: 'LOGA' },
  { text: 'LOGITECH', value: 'LOGITECH' },
  { text: 'MICROPACK', value: 'MICROPACK' },
  { text: 'MSI', value: 'MSI' },
  { text: 'ONIKUMA', value: 'ONIKUMA' },
  { text: 'PULSAR', value: 'PULSAR' },
  { text: 'RAPOO', value: 'RAPOO' },
  { text: 'RAZER', value: 'RAZER' },
  { text: 'ROCCAT', value: 'ROCCAT' },
  { text: 'THUNDERX3', value: 'THUNDERX3' },
]


const Color = [
  { text: 'BLACk', value: 'BLACK' },
  { text: 'WHITE', value: 'WHITE' },
  { text: 'WHITE EDITION', value: 'WHITE EDITION' },
  { text: 'RED', value: 'RED' },
  { text: 'GREEN', value: 'GREEN' },
  { text: 'GRADIENT GREEN', value: 'GRADIENT GREEN' },
  { text: 'BLUE', value: 'BLUE' },
  { text: 'PINK', value: 'PINK' },
  { text: 'GREY', value: 'GREY' },
  { text: 'CHARCOAL', value: 'CHARCOAL' },
  { text: 'BLACK-TRANSPARENT', value: 'BLACK-TRANSPARENT' },
  { text: 'BLACK-RED', value: 'BLACK-RED' },
  { text: 'WHITE-PINK', value: 'WHITE-PINK' },
  { text: 'MATTE NEON MINT', value: 'MATTE NEON MINT' },
  { text: 'MATTE NEON PINK', value: 'MATTE NEON PINK' },
]

const Type = [
  { text: 'WIRELESS', value: 'WIRELESS' },
  { text: 'WIRED', value: 'WIRED' },
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
    setSwitchValue(record.m_status === "Y")
    setFileList([{ url: record.m_img }])
    form.setFieldsValue({
      color: record.m_color,
      type: record.m_type,
      brand: record.m_brand,
      model: record.m_model,
      price_srp: record.m_price_srp,
      discount: record.m_discount,
      href: record.m_href,
      status: record.m_status,
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
    formData.append('upload_preset', 'ta46vhin');

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
          axios.put(API_URL + '/update_img_m/' + record.m_id, { imageUrl })
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
            <Form.Item label="Type" name="type">
              <Select placeholder="Type" allowClear>
                {Type.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
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
      .get(API_URL + "/admin_data_m")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
      .put(API_URL + "/update_stock_m")
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
      .delete(API_URL + `/admin_del_m/${id}`)
      .then(res => {
        setData(data.filter(item => item.m_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_m/' + record.m_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL + '/admin_data_m')
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
    const target = newData.find((item) => item.m_id === key);
    if (target) {
      target.m_status = target.m_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status_m/' + key, { status: target.m_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL + '/admin_data_m')
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
      dataIndex: 'm_img',
      key: 'm_img',
      width: 60,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'm_brand', key: 'm_brand', width: 100,
      render: (text, record) => <a href={record.m_href} target='_blank'>{text}</a>,
      
      filters: Brand,
      onFilter: (value, record) => record.m_brand.indexOf(value) === 0,
      sorter: (a, b) => a.m_brand.localeCompare(b.m_brand),
      sortDirections: ['descend'],
      
    },
    {
      title: 'Model', dataIndex: 'm_model', key: 'm_model',
    },
    
    {
      title: 'Color', dataIndex: 'm_color', key: 'm_color', align: 'center',
    },
    {
      title: 'Type', dataIndex: 'm_type', key: 'm_type', align: 'center',
      filters: Type,
      onFilter: (value, record) => record.m_type.indexOf(value) === 0,
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'm_stock_nny', key: 'm_stock_nny', align: 'center',
          sorter: (a, b) => a.m_stock_nny - b.m_stock_nny,
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
          title: 'รามอินทรา', dataIndex: 'm_stock_ramintra', key: 'm_stock_ramintra', align: 'center',
          sorter: (a, b) => a.m_stock_ramintra - b.m_stock_ramintra,
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
          title: 'บางพลัด', dataIndex: 'm_stock_bangphlat', key: 'm_stock_bangphlat', align: 'center',
          sorter: (a, b) => a.m_stock_bangphlat - b.m_stock_bangphlat,
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
          title: 'เดอะโฟล์ท', dataIndex: 'm_stock_thefloat', key: 'm_stock_thefloat', align: 'center',
          sorter: (a, b) => a.m_stock_thefloat - b.m_stock_thefloat,
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
          title: 'รังสิต', dataIndex: 'm_stock_rangsit', key: 'm_stock_rangsit', align: 'center',
          sorter: (a, b) => a.m_stock_rangsit - b.m_stock_rangsit,
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
          title: 'รวม', dataIndex: 'm_stock_sum', key: 'm_stock_sum', align: 'center', sorter: (a, b) => a.m_stock_sum - b.m_stock_sum,
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
      title: 'Price SRP', dataIndex: 'm_price_srp', key: 'm_price_srp', align: 'right',
      sorter: (a, b) => a.m_price_srp - b.m_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Discount', dataIndex: 'm_discount', key: 'm_discount', align: 'right',
      sorter: (a, b) => a.m_discount - b.m_discount,
      render: (value) => (
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'm_status', key: 'm_status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.m_status === 'Y'} onChange={() => handleStatusChange(record.m_id)}
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
            onConfirm={() => handleDelete(record.m_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.m_id} pagination={pagination} onChange={onChange} bordered size="small"
      
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