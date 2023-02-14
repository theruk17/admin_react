import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tag } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app';

const Brand = [
  { val: 'ACER' },
  { val: 'ASUS' },
  { val: 'DELL' },
  { val: 'HP' },
  { val: 'LENOVO' },
  { val: 'MSI' },
]

const Color = [
  { val: '(OBSIDIAN BLACK)' },
  { val: '(SLATE GREY)' },
  { val: '(OFF BLACK)' },
  { val: '(SHADOW BLACK)'},
  { val: '(GRAPHITE BLACK)' },
  { val: '(MECHA GRAY)' },
  { val: '(QUIET BLUE)' },
  { val: '(INDIE BLACK)' },
  { val: '(CARBON BLACK)' },
  { val: '(DARK SHADOW GREY)' },
  { val: '(SPECTER GREEN WITH CAMOUFLAG)' },
  { val: '(BLACK)' },
  { val: '(NATURAL SILVER)' },
  { val: '(STORM GREY)' },
  { val: '(ONYX GREY)' },

]


const Group = [
  { val: 'Gaming' },
  { val: 'Non-gaming' },
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
    setSwitchValue(record.nb_status === "Y")
    setFileList([{ url: record.nb_img}])
    form.setFieldsValue({
      group: record.nb_group,
      brand: record.nb_brand,
      model: record.nb_model,
      color: record.nb_color,
      price_srp: record.nb_price_srp,
      min_price: record.nb_min_price,
      status: record.nb_status,
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
    formData.append('upload_preset', 'osmgat5m');

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
          axios.put(API_URL+'/update_img_nb/' + record.nb_id, { imageUrl })
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
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
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
          <Col span={6}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Color" allowClear>
                {Color.map(item => (
                  <Select.Option key={item.val} value={item.mnt_val}>{item.val}</Select.Option>
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
                  <Select.Option key={item.val} value={item.val}>{item.label}</Select.Option>
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
            <Form.Item label="Min Price" name="min_price">
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

const CaseData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 50
  });

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL+"/admin_data_nb")
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
      .delete(API_URL+`/admin_del_nb/${id}`)
      .then(res => {
        setData(data.filter(item => item.nb_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL+'/edit_nb/' + record.nb_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL+'/admin_data_nb')
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
    const target = newData.find((item) => item.nb_id === key);
    if (target) {
      target.nb_status = target.nb_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL+'/edit_status_nb/' + key, { status: target.nb_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL+'/admin_data_nb')
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
      title: 'SN', dataIndex: 'nb_id', key: 'nb_id',
    },
    {
      title: 'Image',
      dataIndex: 'nb_img',
      key: 'nb_img',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" width="30" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'nb_brand', key: 'nb_brand',
      render: (text, record) => <a href={record.nb_href} target='_blank'>{text}</a>,

    },
    {
      title: 'Model', dataIndex: 'nb_model', key: 'nb_model',
    },
    {
      title: 'Color', dataIndex: 'nb_color', key: 'nb_color',
    },
    {
      title: 'CPU', dataIndex: 'nb_cpu', key: 'nb_cpu',
    },
    {
      title: 'VGA', dataIndex: 'nb_vga', key: 'nb_vga',
    },
    {
      title: 'RAM', dataIndex: 'nb_ram', key: 'nb_ram',
    },
    {
      title: 'Size', dataIndex: 'nb_size', key: 'nb_size',
    },
    {
      title: 'Hz', dataIndex: 'nb_hz', key: 'nb_hz',
    },
    {
      title: 'Storage', dataIndex: 'nb_storage', key: 'nb_storge',
    },
    {
      title: 'OS', dataIndex: 'nb_os', key: 'nb_os',
    },
    {
      title: 'Status', dataIndex: 'case_status', key: 'case_status',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.nb_status === 'Y'} onChange={() => handleStatusChange(record.nb_id)}
        />
      )
    },
    {
      title: 'Price SRP', dataIndex: 'nb_price_srp', key: 'nb_price_srp',
      sorter: (a, b) => a.nb_price_srp - b.nb_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Min Price', dataIndex: 'nb_min_price', key: 'nb_min_price',
      sorter: (a, b) => a.nb_min_price - b.nb_min_price,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },

    {
      title: 'Action', dataIndex: 'action', key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a key={record} onClick={() => showModal(record)}><EditTwoTone twoToneColor="#ffa940" /></a>
          <Popconfirm
            title="Delete the item"
            onConfirm={() => handleDelete(record.nb_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.nb_id} pagination={pagination} onChange={onChange} size="small"></Table>
      <EditForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        record={record}
      />
    </div>
  );
};

export default CaseData;