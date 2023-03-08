import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app';

const Brand = [
  { val: 'ASUS' },
  { val: 'ALPHACOOL' },
  { val: 'ARCTIC' },
  { val: 'COOLER MASTER' },
  { val: 'CORSAIR' },
  { val: 'DARKFLASH' },
  { val: 'EK' },
  { val: 'ENERMAX' },
  { val: 'EVGA' },
  { val: 'ID-COOLING' },
  { val: 'LIANLI' },
  { val: 'MSI' },
  { val: 'NZXT' },
  { val: 'SAPPHIRE' },
  { val: 'SILVERSTONE' },
  { val: 'THERMALTAKE' },
  { val: 'ZADAK' },
]

const Color = [
  { val: '(BLACK)' },
  { val: '(WHITE)' },
  { val: '(WHITE EDITION)' },
  { val: '(SNOW EDITION)' },

]


const Group = [
  { val: '120MM' },
  { val: '240MM' },
  { val: '280MM' },
  { val: '360MM' },
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
    setSwitchValue(record.lc_status === "Y")
    setFileList([{ url: record.lc_img }])
    form.setFieldsValue({
      group: record.lc_group,
      brand: record.lc_brand,
      model: record.lc_model,
      color: record.lc_color,
      price_srp: record.lc_price_srp,
      discount: record.lc_discount,
      href: record.lc_href,
      status: record.lc_status,
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
    formData.append('upload_preset', 'vqd7vone');

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
          axios.put(API_URL + '/update_img_lc/' + record.lc_id, { imageUrl })
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
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
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

const LcData = () => {
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
      .get(API_URL + "/admin_data_lc")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
      .put(API_URL + "/update_stock_lc")
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
      .delete(API_URL + `/admin_del_lc/${id}`)
      .then(res => {
        setData(data.filter(item => item.lc_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_lc/' + record.lc_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL + '/admin_data_lc')
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
    const target = newData.find((item) => item.lc_id === key);
    if (target) {
      target.lc_status = target.lc_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status_lc/' + key, { status: target.lc_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL + '/admin_data_lc')
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
      dataIndex: 'lc_img',
      key: 'lc_img',
      width: 60,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'lc_brand', key: 'lc_brand', width: 150,
      render: (text, record) => <a href={record.lc_href} target='_blank'>{text}</a>,
      filters: [
        {
          text: 'ALPHACOOL',
          value: 'ALPHACOOL',
        },
        {
          text: 'ARCTIC',
          value: 'ARCTIC',
        },
        {
          text: 'ASUS',
          value: 'ASUS',
        },
        {
          text: 'COOLER MASTER',
          value: 'COOLER MASTER',
        },
        {
          text: 'CORSAIR',
          value: 'CORSAIR',
        },
        {
          text: 'DARKFLASH',
          value: 'DARKFLASH',
        },
        {
          text: 'EK',
          value: 'EK',
        },
        {
          text: 'ENERMAX',
          value: 'ENERMAX',
        },
        {
          text: 'EVGA',
          value: 'EVGA',
        },
        {
          text: 'ID-COOLING',
          value: 'ID-COOLING',
        },
        {
          text: 'LIANLI',
          value: 'LIANLI',
        },
        {
          text: 'MSI',
          value: 'MSI',
        },
        {
          text: 'NZXT',
          value: 'NZXT',
        },
        {
          text: 'SAPPHIRE',
          value: 'SAPPHIRE',
        },
        {
          text: 'SILVERSTONE',
          value: 'SILVERSTONE',
        },
        {
          text: 'THERMALTAKE',
          value: 'THERMALTAKE',
        },
        {
          text: 'ZADAK',
          value: 'ZADAK',
        },

      ],
      onFilter: (value, record) => record.lc_brand.indexOf(value) === 0,
      sorter: (a, b) => a.lc_brand.localeCompare(b.lc_brand),
      sortDirections: ['descend'],
      
    },
    {
      title: 'Model', dataIndex: 'lc_model', key: 'lc_model', width: 350,
    },
    {
      title: 'Color', dataIndex: 'lc_color', key: 'lc_color', width: 140,
    },
    {
      title: 'Size', dataIndex: 'lc_group', key: 'lc_group', align: 'center',
      filters: [
        {
          text: '120MM',
          value: '120MM',
        },
        {
          text: '240MM',
          value: '240MM',
        },
        {
          text: '280MM',
          value: '280MM',
        },
        {
          text: '360MM',
          value: '360MM',
        }
      ],
      onFilter: (value, record) => record.lc_group.indexOf(value) === 0,
      sorter: (a, b) => a.lc_group.localeCompare(b.lc_group),
      sortDirections: ['ascend','descend'],
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'lc_stock_nny', key: 'lc_stock_nny', align: 'center',
          sorter: (a, b) => a.lc_stock_nny - b.lc_stock_nny,
        },
        {
          title: 'รามอินทรา', dataIndex: 'lc_stock_ramintra', key: 'lc_stock_ramintra', align: 'center',
          sorter: (a, b) => a.lc_stock_ramintra - b.lc_stock_ramintra,
        },
        {
          title: 'บางพลัด', dataIndex: 'lc_stock_bangphlat', key: 'lc_stock_bangphlat', align: 'center',
          sorter: (a, b) => a.lc_stock_bangphlat - b.lc_stock_bangphlat,
        },
        {
          title: 'เดอะโฟล์ท', dataIndex: 'lc_stock_thefloat', key: 'lc_stock_thefloat', align: 'center',
          sorter: (a, b) => a.lc_stock_thefloat - b.lc_stock_thefloat,
        },
        {
          title: 'รวม', dataIndex: 'lc_stock_sum', key: 'lc_stock_sum', align: 'center', sorter: (a, b) => a.lc_stock_sum - b.lc_stock_sum,
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
      title: 'Price SRP', dataIndex: 'lc_price_srp', key: 'lc_price_srp', align: 'right',
      sorter: (a, b) => a.lc_price_srp - b.lc_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Discount', dataIndex: 'lc_discount', key: 'lc_discount', align: 'right',
      sorter: (a, b) => a.lc_discount - b.lc_discount,
      render: (value) => (
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'lc_status', key: 'lc_status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.lc_status === 'Y'} onChange={() => handleStatusChange(record.lc_id)}
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
            onConfirm={() => handleDelete(record.lc_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.lc_id} pagination={pagination} onChange={onChange} bordered 
      
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

export default LcData;