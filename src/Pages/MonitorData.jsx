import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Button } from 'antd';
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL

const { Search } = Input;
const { Option } = Select;

const Brand = [
  { text: 'ACER', value: 'ACER' },
  { text: 'AOC', value: 'AOC' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'BENQ', value: 'BENQ' },
  { text: 'COOLER MASTER', value: 'COOLER MASTER' },
  { text: 'DAHUA', value: 'DAHUA' },
  { text: 'DELL', value: 'DELL' },
  { text: 'GIGABYTE', value: 'GIGABYTE' },
  { text: 'LENOVO', value: 'LENOVO' },
  { text: 'LG', value: 'LG' },
  { text: 'MSI', value: 'MSI' },
  { text: 'PHILIPS', value: 'PHILIPS' },
  { text: 'SAMSUNG', value: 'SAMSUNG' },
  { text: 'VIEWSONIC', value: 'VIEWSONIC' },
]

const Size = [
  { text: '21.5"', value: '21.5"' },
  { text: '23.8"', value: '23.8"' },
  { text: '24"', value: '24"' },
  { text: '23.6"', value: '23.6"' },
  { text: '24.5"', value: '24.5"' },
  { text: '27"', value: '27"' },
  { text: '28"', value: '28"' },
  { text: '31.5"', value: '31.5"' },
  { text: '32"', value: '32"' },
  { text: '34"', value: '34"' }
]

const Hz = [
  { text: '60Hz', value: '60Hz' },
  { text: '75Hz', value: '75Hz' },
  { text: '100Hz', value: '100Hz' },
  { text: '144Hz', value: '144Hz' },
  { text: '165Hz', value: '165Hz' },
  { text: '170Hz', value: '170Hz' },
  { text: '180Hz', value: '180Hz' },
  { text: '240Hz', value: '240Hz' },
  { text: '280Hz', value: '280Hz' },
  { text: '360Hz', value: '360Hz' }
]

const Panel = [
  { text: 'VA', value: 'VA' },
  { text: 'IPS', value: 'IPS' },
  { text: 'TN', value: 'TN' },
  { text: 'SS IPS', value: 'SS IPS' },
  { text: 'IPS HDR', value: 'IPS HDR' },
  { text: 'ULTRA-IPS', value: 'ULTRA-IPS' },
  { text: 'IPS FLAT', value: 'IPS FLAT' },
  { text: 'NANO IPS', value: 'NANO IPS' },
  { text: 'WQHD', value: 'WQHD' }
]

const Resolution = [
  { text: '1920x1080 (FHD)', value: '1920x1080 (FHD)' },
  { text: '2560x1440 (2K)', value: '2560x1440 (2K)' },
  { text: '3840x2160 (4K)', value: '3840x2160 (4K)' },
  { text: '3440x1440 (2K)', value: '3440x1440 (2K)' }
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
  const [checked, setChecked] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState(['']);

  const [dataMntGroup, setDataMntGroup] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + "/monitor_group")
      .then((res) => {
        setDataMntGroup(res.data);
      });

    setChecked(record.mnt_curve === "Y")
    setFileList([{ url: API_URL + '/' + record.mnt_img }])
    form.setFieldsValue({
      group: record.mnt_group,
      brand: record.mnt_brand,
      model: record.mnt_model,
      size: record.mnt_size,
      hz: record.mnt_refresh_rate,
      panel: record.mnt_panel,
      resolution: record.mnt_resolution,
      price_srp: record.product_price,
      price_w_com: record.product_minprice,
      curve: record.mnt_curve,
      status: record.status,
      href: record.mnt_href,
    });
  }, [record, form]);


  const onCheckboxChange = (e) => {
    setChecked(e.target.checked);
    form.setFieldsValue({ curve: e.target.checked ? 'Y' : 'N' });
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
    formData.append('id', record.mnt_id);
    formData.append('t_name', 'monitor');
    formData.append('c_name', 'mnt');

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
                  message: 'Please input Model!',
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
                  message: 'Please input Brand!',
                },
              ]}>
              <Select placeholder="Brand" allowClear showSearch>
                {Brand.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Group" name="group"
              rules={[
                {
                  required: true,
                  message: 'Please input Group!',
                },
              ]}>
              <Select placeholder="Group" allowClear>
                {dataMntGroup.map(item => (
                  <Select.Option key={item.mnt_group_id} value={item.mnt_group_id}>{item.mnt_group}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
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
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
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
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Panel" name="panel"
              rules={[
                {
                  required: true,
                  message: 'Please input Panel!',
                },
              ]}>
              <Select placeholder="Panel" allowClear  >
                {Panel.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Resolution" name="resolution"
              rules={[
                {
                  required: true,
                  message: 'Please input Resolation!',
                },
              ]}>
              <Select placeholder="Resolution" allowClear >
                {Resolution.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label="Curve" name="curve" >
              <Checkbox checked={checked} onChange={onCheckboxChange} ></Checkbox>
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
            <Form.Item label="MinPrice" name="price_w_com">
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
  const [dataMntGroup, setDataMntGroup] = useState([]);
  const [filteredData, setFilteredData] = useState([data]);
  const [brands, setBrands] = useState({});
  const [subcats, setSubcats] = useState({});
  const [resolut, setResolut] = useState({});
  const [selectedBrands, setselectedBrands] = useState('all');
  const [selectedSubcats, setSelectedSubcats] = useState('all');
  const [selectedResolut, setSelectedResolut] = useState('all');

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const init = async () => {
    const storedToken = window.localStorage.getItem('token')
    await axios
      .post(API_URL + "/admin_data", {
        t_name: 'monitor', c_name: 'mnt',
        headers: {
          Authorization: storedToken
        }
      })
      .then(async res => {
        setData(res.data);
        setLoading(false);
      });

    axios
      .get(API_URL + "/monitor_group")
      .then((res) => {
        setDataMntGroup(res.data);
      });

  }

  useEffect(() => {
    setLoading(true);
    init()


  }, []);

  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      String(item.mnt_model).toLowerCase().includes(value.trim().toLowerCase()) ||
      String(item.mnt_id).toLowerCase().includes(value.trim().toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    // group the data by a certain property
    const brands = data.reduce((acc, item) => {
      const group = item.mnt_brand
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
      const group = item.mnt_size
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

    const resolut = data.reduce((acc, item) => {
      const group = item.mnt_resolution
      if (group !== '' && group !== null) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
      }

      return acc;
    }, {});

    setResolut(resolut);


    let Data = [...data];

    // Filter data based on selected group
    const filterData = () => {
      if (selectedBrands !== 'all') {
        Data = Data.filter(item => item.mnt_brand === selectedBrands);

      }
      if (selectedSubcats !== 'all') {
        Data = Data.filter(item => item.mnt_size === selectedSubcats);

      }
      if (selectedResolut !== 'all') {
        Data = Data.filter(item => item.mnt_resolution === selectedResolut);

      }
      setFilteredData(Data);
    };

    filterData();
  }, [selectedBrands, selectedSubcats, selectedResolut, data]);

  const handleBrandChange = (value) => {
    setselectedBrands(value);
  };

  const handleSubcatChange = (value) => {
    setSelectedSubcats(value);
  };

  const handleResolutChange = (value) => {
    setSelectedResolut(value);
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
      .delete(API_URL + `/admin_del/${id}`)
      .then(res => {
        setData(data.filter(item => item.sku !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit/' + record.sku, values)
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
    const target = newData.find((item) => item.sku === key);
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
      title: 'Image', dataIndex: 'mnt_img', key: 'mnt_img', width: 60, align: 'center',
      render: (text, record) => <a href={record.mnt_href} target='_blank'><img src={API_URL + '/' + text} alt="" height="30" /></a>,
    },
    {
      title: 'Product name', dataIndex: 'mnt_model', key: 'mnt_model',
      render: (_, record) => <><p>{record.mnt_brand} {record.mnt_model} {record.mnt_size} {record.mnt_panel} {record.mnt_refresh_rate} {record.mnt_resolution}</p>
        <p style={{ lineHeight: 1, fontSize: 10, color: 'Gray' }}><BarcodeOutlined /> {record.mnt_id} - {record.sku}</p></>,
    },
    /*     {
          title: 'Group', dataIndex: 'mnt_group', key: 'mnt_group', align: 'left', width: 130,
        }, */
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
          title: 'รามอินทรา', dataIndex: 'stock_ramintra', key: 'stock_ramintra', width: 70, align: 'center',
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
          title: 'รังสิต', dataIndex: 'stock_rangsit', key: 'stock_rangsit', width: 70, align: 'center',
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
          title: 'บางแสน', dataIndex: 'stock_bangsaen', key: 'stock_bangsaen', width: 70, align: 'center',
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
          title: 'พระราม2', dataIndex: 'stock_rama2', key: 'stock_rama2', align: 'center', width: 70,
          sorter: (a, b) => a.stock_rama2 - b.stock_rama2,
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
        <Switch loading={loading} checkedChildren="On" unCheckedChildren="Off" checked={record.status === 'Y'} onChange={() => handleStatusChange(record.sku)}
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
            onConfirm={() => handleDelete(record.sku)}
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

        <Search placeholder="Search Code, Name" onSearch={handleSearch} enterButton allowClear />

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
          <Option value="all">All Size</Option>
          {Object.keys(subcats).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
        <Select defaultValue="all" onChange={handleResolutChange} style={{
          width: 150,
        }}>
          <Option value="all">All Resolution</Option>
          {Object.keys(resolut).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
      </Space>
      <Table bordered loading={loading} dataSource={filteredData} columns={Column} rowKey={record => record.mnt_id} pagination={pagination} onChange={onChange} size="small" ></Table>
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