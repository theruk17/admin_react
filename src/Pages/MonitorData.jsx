import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Button } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app';

const Brand = [
  { val: 'ACER' },
  { val: 'AOC' },
  { val: 'ASUS' },
  { val: 'BENQ' },
  { val: 'COOLER MASTER' },
  { val: 'DAHUA' },
  { val: 'DELL' },
  { val: 'GIGABYTE' },
  { val: 'LENOVO' },
  { val: 'LG' },
  { val: 'MSI' },
  { val: 'SAMSUNG' },
]

const Size = [
  { val: '21.5"' },
  { val: '23.6"' },
  { val: '23.8"' },
  { val: '24"' },
  { val: '24.5"' },
  { val: '27"' },
  { val: '28"' },
  { val: '31.5"' },
  { val: '32"' },
  { val: '34"' }
]

const Hz = [
  { val: '60Hz' },
  { val: '75Hz' },
  { val: '100Hz' },
  { val: '144Hz' },
  { val: '165Hz' },
  { val: '170Hz' },
  { val: '240Hz' },
  { val: '280Hz' }
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
  { val: '1', label: '21.5" 75Hz' },
  { val: '2', label: '24" 75Hz - 100Hz' },
  { val: '3', label: '24" 144Hz' },
  { val: '4', label: '24" 165Hz - 170Hz' },
  { val: '5', label: '24" 240Hz' },
  { val: '6', label: '27" 75Hz' },
  { val: '7', label: '27" 75Hz 2K' },
  { val: '8', label: '27" 144Hz' },
  { val: '9', label: '27" 165Hz - 170Hz' },
  { val: '10', label: '27" 165Hz - 170Hz 2K' },
  { val: '11', label: '27" 240Hz - 280Hz' },
  { val: '12', label: '27" - 28" 60Hz - 144Hz 4K' },
  { val: '13', label: '31.5" 75Hz - 165Hz' },
  { val: '14', label: '31.5" 75Hz 2K' },
  { val: '15', label: '32" 144Hz - 165Hz 2K' },
  { val: '16', label: '32" 240Hz' },
  { val: '17', label: '34" 144Hz' },
  { val: '18', label: '34" 100Hz - 144Hz 2K' }
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
  const [checked, setChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState(['']);

  useEffect(() => {
    setChecked(record.mnt_curve === "Y")
    setSwitchValue(record.mnt_status === "Y")
    setFileList([{ url: record.mnt_img }])
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
      href: record.mnt_href,
    });
  }, [record, form]);


  const onCheckboxChange = (e) => {
    setChecked(e.target.checked);
    form.setFieldsValue({ curve: e.target.checked ? 'Y' : 'N' });
  };

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
    formData.append('upload_preset', 'iylzchgu');

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
          axios.put(API_URL+'/update_img_mnt/' + record.mnt_id, { imageUrl })
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
                  message: 'Please input Brand!',
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
            <Form.Item name="model" label="Model" 
            rules={[
              {
                required: true,
                message: 'Please input Model!',
              },
            ]}>
              <Input placeholder='Model' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={4}>
            <Form.Item label="Size" name="size"
            rules={[
              {
                required: true,
                message: 'Please input Size!',
              },
            ]}>
              <Select placeholder="Size" allowClear>
                {Size.map(item => (
                  <Select.Option key={item.val} value={item.mnt_val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Refresh Rate" name="hz"
            rules={[
              {
                required: true,
                message: 'Please input Refresh Rate!',
              },
            ]}>
              <Select placeholder="Refresh Rate" allowClear>
                {Hz.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Panel" name="panel"
            rules={[
              {
                required: true,
                message: 'Please input Panel!',
              },
            ]}>
              <Select placeholder="Panel" allowClear  >
                {Panel.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Resolution" name="resolution"
            rules={[
              {
                required: true,
                message: 'Please input Resolation!',
              },
            ]}>
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
              <Checkbox checked={checked} onChange={onCheckboxChange} ></Checkbox>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Group" name="group"
            rules={[
              {
                required: true,
                message: 'Please input Group!',
              },
            ]}>
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price" name="price_srp"
            rules={[
              {
                required: true,
                message: 'Please input Price!',
              },
            ]}>
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="ราคาพร้อมเครื่อง" name="price_w_com"
            rules={[
              {
                required: true,
                message: 'Please input Price!',
              },
            ]}>
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
        <Form.Item label="Upload Image" >
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

const ShowData = () => {
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
      .get(API_URL+"/admin_data")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
    .put(API_URL+"/update_stock_mnt")
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
      .delete(API_URL+`/admin_del/${id}`)
      .then(res => {
        setData(data.filter(item => item.mnt_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL+'/edit/' + record.mnt_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL+'/admin_data')
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
      axios.put(API_URL+'/edit_status/' + key, { status: target.mnt_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL+'/admin_data')
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
      dataIndex: 'mnt_img',
      key: 'mnt_img',
      width: 80,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" width="30" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'mnt_brand', key: 'mnt_brand', width: 130,
      filters: [
        {
          text: 'ACER',
          value: 'ACER',
        },
        {
          text: 'AOC',
          value: 'AOC',
        },
        {
          text: 'ASUS',
          value: 'ASUS',
        },
        {
          text: 'BENQ',
          value: 'BENQ',
        },
        {
          text: 'COOLER MASTER',
          value: 'COOLER MASTER',
        },
        {
          text: 'DAHUA',
          value: 'DAHUA',
        },
        {
          text: 'DELL',
          value: 'DELL',
        },
        {
          text: 'GIGABYTE',
          value: 'GIGABYTE',
        },
        {
          text: 'LENOVO',
          value: 'LENOVO',
        },
        {
          text: 'LG',
          value: 'LG',
        },
        {
          text: 'MSI',
          value: 'MSI',
        },
        {
          text: 'SAMSUNG',
          value: 'SAMSUNG',
        }
      ],
      onFilter: (value, record) => record.mnt_brand.indexOf(value) === 0,
      render: (text, record) => <a href={record.mnt_href} target='_blank'>{text}</a>,
      sorter: (a, b) => a.mnt_brand.localeCompare(b.mnt_brand),
      sortDirections: ['descend'],
    },
    {
      title: 'Model', dataIndex: 'mnt_model', key: 'mnt_model',
      onFilter: (value, record) => record.mnt_model.startsWith(value),
      filterSearch: true,
    },
    {
      title: 'Size', dataIndex: 'mnt_size', key: 'mnt_size', align: 'right', width: 80,
      filters: [
        {
          text: '21.5"',
          value: '21.5"',
        },
        {
          text: '23.6"',
          value: '23.6"',
        },
        {
          text: '23.8"',
          value: '23.8"',
        },
        {
          text: '24"',
          value: '24"',
        },
        {
          text: '24.5"',
          value: '24.5"',
        },
        {
          text: '27"',
          value: '27"',
        },
        {
          text: '28"',
          value: '28"',
        },
        {
          text: '31.5"',
          value: '31.5"',
        },
        {
          text: '32"',
          value: '32"',
        },
        {
          text: '34"',
          value: '34"',
        },
      ],
      onFilter: (value, record) => record.mnt_size.indexOf(value) === 0,
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.mnt_size.localeCompare(b.mnt_size),
      sortDirections: ['ascend','descend'],
    },
    {
      title: 'Refresh Rate', dataIndex: 'mnt_refresh_rate', key: 'mnt_refresh_rate', align: 'right', width: 80,
      filters: [
        {
          text: '60Hz',
          value: '60Hz',
        },
        {
          text: '75Hz',
          value: '75Hz',
        },
        {
          text: '100Hz',
          value: '100Hz',
        },
        {
          text: '144Hz',
          value: '144Hz',
        },
        {
          text: '165Hz',
          value: '165Hz',
        },
        {
          text: '170Hz',
          value: '170Hz',
        },
        {
          text: '240Hz',
          value: '240Hz',
        },
        {
          text: '280Hz',
          value: '280Hz',
        }
      ],
      onFilter: (value, record) => record.mnt_refresh_rate.indexOf(value) === 0,
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.mnt_refresh_rate.localeCompare(b.mnt_refresh_rate),
      sortDirections: ['ascend','descend'],
    },
    {
      title: 'Panel', dataIndex: 'mnt_panel', key: 'mnt_panel', align: 'right', width: 80,
      filters: [
        {
          text: 'TN',
          value: 'TN',
        },
        {
          text: 'VA',
          value: 'VA',
        },
        {
          text: 'IPS',
          value: 'IPS',
        },
        {
          text: 'NANO IPS',
          value: 'NANO IPS',
        },
        {
          text: 'WQHD',
          value: 'WQHD',
        }
      ],
      onFilter: (value, record) => record.mnt_panel.indexOf(value) === 0,
      sorter: (a, b) => a.mnt_panel.localeCompare(b.mnt_panel),
      sortDirections: ['ascend','descend'],
    },
    {
      title: 'Resolution', dataIndex: 'mnt_resolution', key: 'mnt_resolution', align: 'right', width: 140,
      filters: [
        {
          text: '1920 x 1080 (FHD)',
          value: '1920 x 1080 (FHD)',
        },
        {
          text: '2560 x 1440 (2K)',
          value: '2560 x 1440 (2K)',
        },
        {
          text: '3440 x 1440 (2K)',
          value: '3440 x 1440 (2K)',
        },
        {
          text: '3840 x 2160 (4K)',
          value: '3840 x 2160 (4K)',
        }
      ],
      onFilter: (value, record) => record.mnt_resolution.indexOf(value) === 0,
      sorter: (a, b) => a.mnt_resolution.localeCompare(b.mnt_resolution),
      sortDirections: ['ascend','descend'],
    },
    {
      title: 'Curve', dataIndex: 'mnt_curve', key: 'mnt_curve', align: 'center', width: 50,
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'mnt_stock_nny', key: 'mnt_stock_nny', align: 'center', width: 60,
          sorter: (a, b) => a.mnt_stock_nny - b.mnt_stock_nny,
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
          title: 'รามอินทรา', dataIndex: 'mnt_stock_ramintra', key: 'mnt_stock_ramintra', align: 'center', width: 60,
          sorter: (a, b) => a.mnt_stock_ramintra - b.mnt_stock_ramintra,
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
          title: 'บางพลัด', dataIndex: 'mnt_stock_bangphlat', key: 'mnt_stock_bangphlat', align: 'center', width: 60,
          sorter: (a, b) => a.mnt_stock_bangphlat - b.mnt_stock_bangphlat,
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
          title: 'เดอะโฟล์ท', dataIndex: 'mnt_stock_thefloat', key: 'mnt_stock_thefloat', align: 'center' , width: 60,
          sorter: (a, b) => a.mnt_stock_thefloat - b.mnt_stock_thefloat,
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
          title: 'รังสิต', dataIndex: 'mnt_stock_rangsit', key: 'mnt_stock_rangsit', align: 'center',
          sorter: (a, b) => a.mnt_stock_rangsit - b.mnt_stock_rangsit,
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
          title: 'รวม', dataIndex: 'mnt_stock_sum', key: 'mnt_stock_sum', align: 'center', width: 60, sorter: (a, b) => a.mnt_stock_sum - b.mnt_stock_sum,
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
      title: 'Price SRP', dataIndex: 'mnt_price_srp', key: 'mnt_price_srp', align: 'right', width: 100,
      sorter: (a, b) => a.mnt_price_srp - b.mnt_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'ซื้อพร้อมเครื่อง', dataIndex: 'mnt_price_w_com', key: 'mnt_price_w_com', align: 'right', width: 100,
      sorter: (a, b) => a.mnt_price_w_com - b.mnt_price_w_com,
      render: (value) => (
        <NumericFormat style={{ color: "#f5222d" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'mnt_status', key: 'mnt_status', align: 'center', width: 100,
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.mnt_status === 'Y'} onChange={() => handleStatusChange(record.mnt_id)}
        />
      )
    },
    {
      title: 'Action', dataIndex: 'action', key: 'action', align: 'center', width: 80,
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
      <Table bordered loading={loading} dataSource={data} columns={Column} rowKey={record => record.mnt_id} pagination={pagination} onChange={onChange} size="small"></Table>
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