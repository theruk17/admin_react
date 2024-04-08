import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL

const { Search } = Input;
const { Option } = Select;

const Brand = [
  { text: 'AKKO', value: 'AKKO' },
  { text: 'ALTEC LANSING', value: 'ALTEC LANSING' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'CHERRY', value: 'CHERRY' },
  { text: 'CORSAIR', value: 'CORSAIR' },
  { text: 'DAREU', value: 'DAREU' },
  { text: 'EGA', value: 'EGA' },
  { text: 'FANTECH', value: 'FANTECH' },
  { text: 'FIIO', value: 'FIIO' },
  { text: 'GLORIOUS', value: 'GLORIOUS' },
  { text: 'HyperX', value: 'HyperX' },
  { text: 'KEYDOUS', value: 'KEYDOUS' },
  { text: 'LOGA', value: 'LOGA' },
  { text: 'LOGITECH', value: 'LOGITECH' },
  { text: 'MELGEEK', value: 'MELGEEK' },
  { text: 'MONSGEEK', value: 'MONSGEEK' },
  { text: 'MICROPACK', value: 'MICROPACK' },
  { text: 'NEOLUTION', value: 'NEOLUTION' },
  { text: 'NUBWO', value: 'NUBWO' },
  { text: 'OKER', value: 'OKER' },
  { text: 'ONIKUMA', value: 'ONIKUMA' },
  { text: 'RAZER', value: 'RAZER' },
  { text: 'ROYAL KLUDGE', value: 'ROYAL KLUDGE' },
  { text: 'SARU', value: 'SARU' },
  { text: 'SIGNO', value: 'SIGNO' },
  { text: 'TSUNAMI', value: 'TSUNAMI' },
]

const SW = [
  { text: 'RED SWITCH', value: 'RED SWITCH' },
  { text: 'RED SWITCH A', value: 'RED SWITCH A' },
  { text: 'RED SWITCH B', value: 'RED SWITCH B' },
  { text: 'RED SWITCH C', value: 'RED SWITCH C' },
  { text: 'RED SWITCH D', value: 'RED SWITCH D' },
  { text: 'BLUE SWITCH', value: 'BLUE SWITCH' },
  { text: 'BLUE SWITCH A', value: 'BLUE SWITCH A' },
  { text: 'BLUE SWITCH B', value: 'BLUE SWITCH B' },
  { text: 'BLUE SWITCH C', value: 'BLUE SWITCH C' },
  { text: 'BLUE SWITCH D', value: 'BLUE SWITCH D' },
  { text: 'BROWN SWITCH', value: 'BROWN SWITCH' },
  { text: 'SKY CYAN SWITCH', value: 'SKY CYAN SWITCH' },
  { text: 'PINK RED SWITCH', value: 'PINK RED SWITCH' },
  { text: 'BLACK RED SWITCH', value: 'BLACK RED SWITCH' },
  { text: 'GRAY RED SWITCH', value: 'GRAY RED SWITCH' },
  { text: 'TTC RED SWITCH', value: 'TTC RED SWITCH' },
  { text: 'GRAY BLUE SWITCH', value: 'GRAY BLUE SWITCH' },
  { text: 'AKKO WINE WHITE SWITCH', value: 'AKKO WINE WHITE SWITCH' },
  { text: 'AKKO WINE RED SWITCH', value: 'AKKO WINE RED SWITCH' },
  { text: 'AKKO JELLY BLUE SWITCH', value: 'AKKO JELLY BLUE SWITCH' },
  { text: 'AKKO JELLY PINK SWITCH', value: 'AKKO JELLY PINK SWITCH' },
  { text: 'AKKO JELLY PURPLE SWITCH', value: 'AKKO JELLY PURPLE SWITCH' },
  { text: 'AKKO CREAM YELLOW MAGNETIC SWITCH', value: 'AKKO CREAM YELLOW MAGNETIC SWITCH' },
  { text: 'AKKO V2 PINK SWITCH', value: 'AKKO V2 PINK SWITCH' },
  { text: 'AKKO V2 BLUE SWITCH', value: 'AKKO V2 BLUE SWITCH' },
  { text: 'AKKO V3 CREAM BLUE SWITCH', value: 'AKKO V3 CREAM BLUE SWITCH' },
  { text: 'AKKO V3 CREAM BLUE PRO SWITCH', value: 'AKKO V3 CREAM BLUE PRO SWITCH' },
  { text: 'AKKO V3 CREAM YELLOW SWITCH', value: 'AKKO V3 CREAM YELLOW SWITCH' },
  { text: 'AKKO V3 CREAM YELLOW PRO SWITCH', value: 'AKKO V3 CREAM YELLOW PRO SWITCH' },
  { text: 'AKKO V3 PIANO PRO', value: 'AKKO V3 PIANO PRO' },
  { text: 'AKKO CS SILVER', value: 'AKKO CS SILVER' },
  { text: 'AKKO CS CRYSTAL', value: 'AKKO CS CRYSTAL' },
  { text: 'AKKO PINK SWITCH', value: 'AKKO PINK SWITCH' },
  { text: 'CHERRY VIOLA', value: 'CHERRY VIOLA' },
  { text: 'CHERRY MX RGB BLUE', value: 'CHERRY MX RGB BLUE' },
  { text: 'ROG RX RED OPTICAL', value: 'ROG RX RED OPTICAL' },
  { text: 'ROG RX BLUE OPTICAL', value: 'ROG RX BLUE OPTICAL' },
  { text: 'ROG NX RED', value: 'ROG NX RED' },
  { text: 'ROG NX BROWN', value: 'ROG NX BROWN' },
  { text: 'ROG NX BLUE', value: 'ROG NX BLUE' },
  { text: 'GATERON YELLOW', value: 'GATERON YELLOW' },
  { text: 'GATERON BROWN PRO SW', value: 'GATERON BROWN PRO SW' },
  { text: 'GATERON YELLOW PRO SW', value: 'GATERON YELLOW PRO SW' },
  { text: 'JWK RED SW', value: 'JWK RED SW' },
  { text: 'RAZER YELLOW SWITCH', value: 'RAZER YELLOW SWITCH' },
  { text: 'RAZER GREEN SWITCH', value: 'RAZER GREEN SWITCH' },
  { text: 'CORSAIR OPX OPTICAL SWITCH', value: 'CORSAIR OPX OPTICAL SWITCH' },
  { text: 'GX BLUE CLICKY', value: 'GX BLUE CLICKY' },
  { text: 'GX RED LINEAR', value: 'GX RED LINEAR' },
  { text: 'GX BROWN TACTILE', value: 'GX BROWN TACTILE' },
  { text: 'KAILH ICE CREAM PINK', value: 'KAILH ICE CREAM PINK' },
  { text: 'KAILH PIXEL L', value: 'KAILH PIXEL L' },
  { text: 'KAILH PIXEL T', value: 'KAILH PIXEL T' },
  { text: 'KAILH TURBO RED', value: 'KAILH TURBO RED' },
  { text: 'KAILH TURBO BROWN', value: 'KAILH TURBO BROWN' },
  { text: 'KAILH TURBO SILVE', value: 'KAILH TURBO SILVE' },
  { text: 'KAILH SAKURA PINK MAGNETIC SWITCH', value: 'KAILH SAKURA PINK MAGNETIC SWITCH' },
  { text: 'RUBBER DOME', value: 'RUBBER DOME' },
  { text: 'TACTILE SWITCH', value: 'TACTILE SWITCH' },
  { text: 'TITAN SWITCH', value: 'TITAN SWITCH' },
  { text: 'SILVER SWITCH', value: 'SILVER SWITCH' },
  { text: 'LINEAR', value: 'LINEAR' },
  { text: 'TACTLE', value: 'TACTLE' },
  { text: 'LINEAR (นมเย็น)', value: 'LINEAR (นมเย็น)' },
  { text: 'TACTLE (ชาไทย)', value: 'TACTLE (ชาไทย)' },
  { text: 'RAINBOW LED', value: 'RAINBOW LED' },
]

const Color = [

  { text: 'WHITE', value: 'WHITE' },
  { text: 'BLACK', value: 'BLACK' },
  { text: 'PINK', value: 'PINK' },
  { text: 'GRAY', value: 'GRAY' },
  { text: 'SILVER', value: 'SILVER' },
  { text: 'PURPLE', value: 'PURPLE' },
  { text: 'LAVENDER', value: 'LAVENDER' },
  { text: 'RED WINE', value: 'RED WINE' },
  { text: 'BLACK/GRAY', value: 'BLACK/GRAY' },
  { text: 'DARK KNIGHT', value: 'DARK KNIGHT' },
  { text: 'MOONLIGHT WHITE', value: 'MOONLIGHT WHITE' },
  { text: 'CANVAS', value: 'CANVAS' },
  { text: 'PALETTE', value: 'PALETTE' },
  { text: 'WHITE NIGHT', value: 'WHITE NIGHT' },
  { text: 'WHITE ICE', value: 'WHITE ICE' },
  { text: 'WHITE POWDER', value: 'WHITE POWDER' },
  { text: 'BLUE NAVY', value: 'BLUE NAVY' },
  { text: 'BLACK SLATE', value: 'BLACK SLATE' },
  { text: 'BLACK&CYAN', value: 'BLACK&CYAN' },
  { text: 'BLACK&GOLD', value: 'BLACK&GOLD' },
  { text: 'GATERON YELLOW', value: 'GATERON YELLOW' },
  { text: 'GATERON YELLOW PRO', value: 'GATERON YELLOW PRO' },
  { text: 'KAILH BOX WHITE', value: 'KAILH BOX WHITE' },
  { text: 'GRAPHITE GRAY', value: 'GRAPHITE GRAY' },
  { text: 'CEMENT GRAY', value: 'CEMENT GRAY' },
  { text: 'MECHANICAL GREY', value: 'MECHANICAL GREY' },
  { text: 'MANGO STICKY RICE', value: 'MANGO STICKY RICE' },
  { text: 'TARO MILK', value: 'TARO MILK' },
  { text: 'WHITE CASE/STEEL PLATE', value: 'WHITE CASE/STEEL PLATE' },
]

const Type = [
  { text: 'Wired', value: 'Wired' },
  { text: 'Wireless', value: 'Wireless' },
  { text: 'Bluetooth', value: 'Bluetooth' },
  { text: 'Wired/Barebone', value: 'Wired/Barebone' },
  { text: 'Wireless/Wired', value: 'Wireless/Wired' },
  { text: 'Wireless/Bluetooth/Wired', value: 'Wireless/Bluetooth/Wired' },
]

const Group = [
  { text: 'FULL SIZE 100%', value: 'FULL SIZE 100%' },
  { text: 'BAREBONE/100%', value: 'BAREBONE/100%' },
  { text: 'TKL 87%', value: 'TKL 87%' },
  { text: 'TKL 80%', value: 'TKL 80%' },
  { text: 'BAREBONE/98%', value: 'BAREBONE/98%' },
  { text: '98%', value: '98%' },
  { text: '96%', value: '96%' },
  { text: 'BAREBONE/75%', value: 'BAREBONE/75%' },
  { text: '75%', value: '75%' },
  { text: '65%', value: '65%' },
  { text: '60%', value: '60%' },
  { text: 'NUMPAD', value: 'NUMPAD' },

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
    setFileList([{ url: API_URL + '/' + record.kb_img }])
    form.setFieldsValue({
      sw: record.kb_switch,
      color: record.kb_color,
      brand: record.kb_brand,
      group: record.kb_group,
      connect: record.kb_connect,
      model: record.kb_model,
      price_srp: record.product_price,
      discount: record.product_minprice,
      href: record.kb_href,
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
    formData.append('id', record.kb_id);
    formData.append('t_name', 'kb');
    formData.append('c_name', 'kb');

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

        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Switch" name="sw">
              <Select placeholder="Switch" allowClear showSearch>
                {SW.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Color" allowClear showSearch>
                {Color.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear showSearch>
                {Group.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Type" name="connect">
              <Select placeholder="Color" allowClear showSearch>
                {Type.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="Price SRP" name="price_srp">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0} readOnly
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="MinPrice" name="discount">
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

const FanData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 100
  });
  const [filteredData, setFilteredData] = useState([data]);
  const [brands, setBrands] = useState({});
  const [subcats, setSubcats] = useState({});
  const [connect, setConnect] = useState({});
  const [selectedBrands, setselectedBrands] = useState('all');
  const [selectedSubcats, setSelectedSubcats] = useState('all');
  const [selectedConnect, setSelectedConnect] = useState('all');

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const init = () => {
    const storedToken = window.localStorage.getItem('token')
    axios
      .post(API_URL + "/admin_data", {
        t_name: 'kb', c_name: 'kb',
        headers: {
          'Authorization': storedToken
        }
      })
      .then((res) => {
        setData(res.data);
        setLoading(false)
      });
  }

  useEffect(() => {
    setLoading(true);
    init()

  }, []);

  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      String(item.kb_model).toLowerCase().includes(value.trim().toLowerCase()) ||
      String(item.kb_id).toLowerCase().includes(value.trim().toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    // group the data by a certain property
    const brands = data.reduce((acc, item) => {
      const group = item.kb_brand
      if (group !== '' && group !== null) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
      }

      return acc;
    }, {});

    setBrands(brands);

    const connect = data.reduce((acc, item) => {
      const group = item.kb_connect
      if (group !== '' && group !== null) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
      }

      return acc;
    }, {});

    setConnect(connect);


    // group the data by a certain property
    const subcats = data.reduce((acc, item) => {
      const group = item.kb_group
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
        Data = Data.filter(item => item.kb_brand === selectedBrands);

      }
      if (selectedSubcats !== 'all') {
        Data = Data.filter(item => item.kb_group === selectedSubcats);

      }
      if (selectedConnect !== 'all') {
        Data = Data.filter(item => item.kb_connect === selectedConnect);

      }
      setFilteredData(Data);
    };

    filterData();
  }, [selectedBrands, selectedSubcats, selectedConnect, data]);

  const handleBrandChange = (value) => {
    setselectedBrands(value);
  };

  const handleSubcatChange = (value) => {
    setSelectedSubcats(value);
  };

  const handleConnectChange = (value) => {
    setSelectedConnect(value);
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
      .delete(API_URL + `/admin_del_kb/${id}`)
      .then(res => {
        setData(data.filter(item => item.sku !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_kb/' + record.sku, values)
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
      title: 'Image',
      dataIndex: 'kb_img',
      key: 'kb_img',
      width: 60,
      align: 'center',
      render: (text, record) => <a href={record.kb_href} target='_blank'><img src={API_URL + '/' + text} alt="" height="30" /></a>,
    },
    {
      title: 'Product name', dataIndex: 'kb_model', key: 'kb_model',
      render: (_, record) => <><p>{record.kb_brand} {record.kb_model} {record.kb_switch} {record.kb_color} </p>
        <p style={{ lineHeight: 1, fontSize: 10, color: 'Gray' }}><BarcodeOutlined /> {record.kb_id}</p></>,
    },
    {
      title: 'Group', dataIndex: 'kb_group', key: 'kb_group', align: 'left', width: 120,
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
          title: 'บางนา', dataIndex: 'stock_bangna', key: 'stock_bangna', align: 'center', width: 70,
          sorter: (a, b) => a.stock_bangna - b.stock_bangna,
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
          title: 'โคราช', dataIndex: 'stock_korat', key: 'stock_korat', align: 'center', width: 70,
          sorter: (a, b) => a.stock_korat - b.stock_korat,
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
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
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
          <Option value="all">All Group</Option>
          {Object.keys(subcats).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
        <Select defaultValue="all" onChange={handleConnectChange} style={{
          width: 150,
        }}>
          <Option value="all">All Type</Option>
          {Object.keys(connect).map(group => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
      </Space>
      <Table loading={loading} dataSource={filteredData} columns={Column} rowKey={record => record.kb_id} pagination={pagination} onChange={onChange} bordered size="small"></Table>
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