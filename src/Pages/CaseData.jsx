import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tag } from 'antd';

import '../App.css';

const API_URL = import.meta.env.VITE_API_URL

const { Search } = Input;
const { Option } = Select;

const Brand = [
  { text: 'AEROCOOL', value: 'AEROCOOL' },
  { text: 'ANTEC', value: 'ANTEC' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'AXEL', value: 'AXEL' },
  { text: 'AZZA', value: 'AZZA' },
  { text: 'BE QUIET', value: 'BE QUIET' },
  { text: 'COOLER MASTER', value: 'COOLER MASTER' },
  { text: 'CORSAIR', value: 'CORSAIR' },
  { text: 'DARKFLASH', value: 'DARKFLASH' },
  { text: 'FRACTAL', value: 'FRACTAL' },
  { text: 'GIGABYTE', value: 'GIGABYTE' },
  { text: 'JONSBO', value: 'JONSBO' },
  { text: 'LIAN LI', value: 'LIAN LI' },
  { text: 'INWIN', value: 'INWIN' },
  { text: 'iHAVECPU', value: 'iHAVECPU' },
  { text: 'MONTECH', value: 'MONTECH' },
  { text: 'NEOLUTION', value: 'NEOLUTION' },
  { text: 'MSI', value: 'MSI' },
  { text: 'OCPC', value: 'OCPC' },
  { text: 'NZXT', value: 'NZXT' },
  { text: 'PLENTY', value: 'PLENTY' },
  { text: 'SILVERSTONE', value: 'SILVERSTONE' },
  { text: 'THERMALTAKE', value: 'THERMALTAKE' },
  { text: 'TSUNAMI', value: 'TSUNAMI' },
  { text: 'VENUS', value: 'VENUS' },
  { text: 'XIGMATEK', value: 'XIGMATEK' },
  { text: 'ZALMAN', value: 'ZALMAN' },

]

const Color = [
  { text: '(BLACK)', value: '(BLACK)' },
  { text: '(WHITE)', value: '(WHITE)' },
  { text: '(RED)', value: '(RED)' },
  { text: '(BLUE)', value: '(BLUE)' },
  { text: '(ORANGE)', value: '(ORANGE)' },
  { text: '(SNOW WHITE)', value: '(SNOW WHITE)' },
  { text: '(BLACK/RED)', value: '(BLACK/RED)' },
  { text: '(BLACK/WHITE)', value: '(BLACK/WHITE)' },
  { text: '(GRAY)', value: '(GRAY)' },
  { text: '(CYAN)', value: '(CYAN)' },
  { text: '(PURPLE)', value: '(PURPLE)' },
  { text: '(PINK)', value: '(PINK)' },
  { text: '(SILVER)', value: '(SILVER)' },
  { text: '(MATTE BLACK)', value: '(MATTE BLACK)' },
  { text: '(MATTE WHITE)', value: '(MATTE WHITE)' },
  { text: '(MESH BLACK)', value: '(MESH BLACK)' },
  { text: '(MESH WHITE)', value: '(MESH WHITE)' },
  { text: '(RAZER EDITION)', value: '(RAZER EDITION)' },
  { text: '(YELLOW)', value: '(YELLOW)' },

]


const Group = [
  { text: 'ZONE A', value: 'ZONE A' },
  { text: 'ZONE B', value: 'ZONE B' },
  { text: 'ZONE C', value: 'ZONE C' },
  { text: 'ZONE EXPENSIVE', value: 'ZONE EXPENSIVE' },
  { text: 'ZONE ITX', value: 'ZONE ITX' },
]

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1MB!');
  }
  return isJpgOrPng && isLt2M;
};

const EditForm = ({ visible, onCreate, onCancel, record }) => {
  const [form] = Form.useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setFileList([{ url: API_URL + '/' + record.case_img }])
    form.setFieldsValue({
      group: record.case_group,
      brand: record.case_brand,
      model: record.case_model,
      color: record.case_color,
      price_srp: record.product_price,
      minprice: record.product_minprice,
      href: record.case_href,
      status: record.status,
    });
  }, [record, form]);


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
    formData.append('id', record.case_id);
    formData.append('t_name', 'case');
    formData.append('c_name', 'case');

    try {
      axios.post(API_URL + '/uploadimg', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent });
        }
      })
        .then(res => {
          console.log(res);
          const imageUrl = res.data.secure_url;
          message.success("Upload Image to Server " + res.statusText);
          onSuccess(imageUrl);

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
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="model" label="Model"
              rules={[
                {
                  required: true,
                  message: 'Please input your Model!',
                },
              ]}>
              <Input placeholder='Model' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand"
              rules={[
                {
                  required: true,
                  message: 'Please input your Brand!',
                },
              ]}>
              <Select placeholder="Brand" allowClear showSearch>
                {Brand.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Color" allowClear>
                {Color.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Price" name="price_srp">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0} readOnly
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="MinPrice" name="minprice">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0} readOnly
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
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

const CaseData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 100
  });
  const [filteredData, setFilteredData] = useState(data);
  const [brands, setBrands] = useState({});
  const [subcats, setSubcats] = useState({});
  const [selectedBrands, setselectedBrands] = useState('all');
  const [selectedSubcats, setSelectedSubcats] = useState('all');

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const init = () => {
    axios
      .post(API_URL + "/admin_data", { t_name: 'case', c_name: 'case' })
      .then((res) => {
        setData(res.data);
        setselectedBrands("all")
        setSelectedSubcats("all")
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    init()

  }, []);

  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      String(item.case_model).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    // group the data by a certain property
    const brands = data.reduce((acc, item) => {
      const group = item.case_brand
      if (group !== '' && group !== null) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
      }

      return acc;
    }, {});

    setBrands(brands);


    // group the data by a certain property
    const subcats = data.reduce((acc, item) => {
      const group = item.case_group
      if (group !== '' && group !== null) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
      }

      return acc;
    }, {});
    // Sort the groups in ascending order
    const sortedGroups = Object.keys(subcats).sort();

    // Create a new object with sorted groups
    const sortedGroupsObj = {};
    sortedGroups.forEach((key) => {
      sortedGroupsObj[key] = subcats[key];
    });

    setSubcats(sortedGroupsObj);


    let Data = [...data];
    // Filter data based on selected group
    const filterData = () => {
      if (selectedBrands !== 'all') {
        Data = Data.filter(item => item.case_brand === selectedBrands);

      }
      if (selectedSubcats !== 'all') {
        Data = Data.filter(item => item.case_group === selectedSubcats);

      }
      setFilteredData(Data);
    };

    filterData();
  }, [selectedBrands, selectedSubcats, data]);

  const handleBrandChange = (value) => {
    setselectedBrands(value);
  };

  const handleSubcatChange = (value) => {
    setSelectedSubcats(value);
  };

  const showModal = (record) => {
    setVisible(true);
    setRecord(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = id => {
    axios
      .delete(API_URL + `/admin_del_case/${id}`)
      .then(res => {
        setData(data.filter(item => item.case_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_case/' + record.case_id, values)
      .then(res => {
        setVisible(false)
        message.success(res.data);
        init()
      })
      .catch(err => {
        console.log(err);
        message.error('Error updating data');
      });
  };




  const handleStatusChange = (key) => {
    setLoading(true)
    const newData = [...data];
    const target = newData.find((item) => item.product_id === key);
    if (target) {
      target.status = target.status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status/' + key, { status: target.status })
        .then(res => {
          message.success(res.data);
          setLoading(false)
          init()
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
      dataIndex: 'case_img',
      key: 'case_img',
      width: 60,
      align: 'center',
      render: (text, record) => <a href={record.case_href} target='_blank'><img src={API_URL + '/' + text} alt="" height="30" /></a>,
    },
    {
      title: 'Product name', dataIndex: 'case_model', key: 'case_model',
      render: (_, record) => <><p>{record.case_brand} {record.case_model} {record.case_color}</p>
        <p style={{ lineHeight: 1, fontSize: 10, color: 'Gray' }}><BarcodeOutlined /> {record.case_id}</p></>,
    },
    {
      title: 'Group', dataIndex: 'case_group', key: 'case_group', align: 'left', width: 130,
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'stock_nny', key: 'stock_nny', align: 'center', width: 70,
          sorter: (a, b) => a.stock_nny - b.stock_nny,
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
          title: 'รามอินทรา', dataIndex: 'stock_ramintra', key: 'stock_ramintra', align: 'center', width: 70,
          sorter: (a, b) => a.stock_ramintra - b.stock_ramintra,
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
          title: 'บางพลัด', dataIndex: 'stock_bangphlat', key: 'stock_bangphlat', align: 'center', width: 70,
          sorter: (a, b) => a.stock_bangphlat - b.stock_bangphlat,
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
          title: 'เดอะโฟล์ท', dataIndex: 'stock_thefloat', key: 'stock_thefloat', align: 'center', width: 70,
          sorter: (a, b) => a.stock_thefloat - b.stock_thefloat,
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
          title: 'รังสิต', dataIndex: 'stock_rangsit', key: 'stock_rangsit', align: 'center', width: 70,
          sorter: (a, b) => a.stock_rangsit - b.stock_rangsit,
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
          title: 'บางแสน', dataIndex: 'stock_bangsaen', key: 'stock_bangsaen', align: 'center', width: 70,
          sorter: (a, b) => a.stock_bangsaen - b.stock_bangsaen,
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
          title: 'รวม', dataIndex: 'sumstock', key: 'sumstock', align: 'center', width: 70,
          sorter: (a, b) => a.sumstock - b.sumstock,
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
      title: 'Price SRP', dataIndex: 'product_price', key: 'product_price', align: 'right', width: 100,
      sorter: (a, b) => a.product_price - b.product_price,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'MinPrice', dataIndex: 'product_minprice', key: 'product_minprice', align: 'right', width: 100,
      sorter: (a, b) => a.product_minprice - b.product_minprice,
      render: (value) => (
        <NumericFormat style={{ color: "#f5222d" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },

    {
      title: 'Status', dataIndex: 'status', key: 'status', align: 'center', width: 100,
      render: (text, record) => (
        <Switch loading={loading} checkedChildren="On" unCheckedChildren="Off" checked={record.status === 'Y'} onChange={() => handleStatusChange(record.product_id)}
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
            onConfirm={() => handleDelete(record.case_id)}
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
      <Space style={{
        marginBottom: 8,
      }} split={<Divider type="vertical" />}>

        <Search placeholder="Search only by NAME" onSearch={handleSearch} enterButton allowClear />

        <Select defaultValue="all" onChange={handleBrandChange} style={{
          width: 150,
        }}>
          <Option value="all">All Brands</Option>
          {Object.keys(brands).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
        <Select defaultValue="all" onChange={handleSubcatChange} style={{
          width: 150,
        }}>
          <Option value="all">All Group</Option>
          {Object.keys(subcats).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
      </Space>
      <Table bordered loading={loading} dataSource={filteredData} columns={Column} rowKey={record => record.case_id} pagination={pagination} onChange={onChange} size="small"></Table>
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