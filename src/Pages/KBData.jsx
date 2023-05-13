import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app';

const Brand = [
  { text: 'AKKO', value: 'AKKO' },
  { text: 'ASUS', value: 'ASUS' },
  { text: 'CORSAIR', value: 'CORSAIR' },
  { text: 'EGA', value: 'EGA' },
  { text: 'GLORIOUS', value: 'GLORIOUS' },
  { text: 'HyperX', value: 'HyperX' },
  { text: 'KEYDOUS', value: 'KEYDOUS' },
  { text: 'LOGA', value: 'LOGA' },
  { text: 'LOGITECH', value: 'LOGITECH' },
  { text: 'MELGEEK', value: 'MELGEEK' },
  { text: 'MICROPACK', value: 'MICROPACK' },
  { text: 'NUBWO', value: 'NUBWO' },
  { text: 'OKER', value: 'OKER' },
  { text: 'ONIKUMA', value: 'ONIKUMA' },
  { text: 'RAZER', value: 'RAZER' },
  { text: 'ROYAL KLUDGE', value: 'ROYAL KLUDGE' },
  { text: 'SARU', value: 'SARU' },
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
  { text: 'GRAY BLUE SWITCH', value: 'GRAY BLUE SWITCH' },
  { text: 'AKKO WINE WHITE SWITCH', value: 'AKKO WINE WHITE SWITCH' },
  { text: 'AKKO WINE RED SWITCH', value: 'AKKO WINE RED SWITCH' },
  { text: 'AKKO JELLY BLUE SWITCH', value: 'AKKO JELLY BLUE SWITCH' },
  { text: 'AKKO JELLY PINK SWITCH', value: 'AKKO JELLY PINK SWITCH' },
  { text: 'AKKO JELLY PURPLE SWITCH', value: 'AKKO JELLY PURPLE SWITCH' },
  { text: 'AKKO V2 PINK SWITCH', value: 'AKKO V2 PINK SWITCH' },
  { text: 'AKKO PINK SWITCH', value: 'AKKO PINK SWITCH' },
  { text: 'ROG RX RED OPTICAL', value: 'ROG RX RED OPTICAL' },
  { text: 'ROG RX BLUE OPTICAL', value: 'ROG RX BLUE OPTICAL' },
  { text: 'ROG NX RED', value: 'ROG NX RED' },
  { text: 'ROG NX BROWN', value: 'ROG NX BROWN' },
  { text: 'ROG NX BLUE', value: 'ROG NX BLUE' },
  { text: 'GATERON BROWN PRO SW', value: 'GATERON BROWN PRO SW' },
  { text: 'GATERON YELLOW PRO SW', value: 'GATERON YELLOW PRO SW' },
  { text: 'JWK RED SW', value: 'JWK RED SW' },
  { text: 'RAZER YELLOW SWITCH', value: 'RAZER YELLOW SWITCH' },
  { text: 'RAZER GREEN SWITCH', value: 'RAZER GREEN SWITCH' },
  { text: 'CORSAIR OPX OPTICAL SWITCH', value: 'CORSAIR OPX OPTICAL SWITCH' },
  { text: 'GX BLUE CLICKY', value: 'GX BLUE CLICKY' },
  { text: 'GX RED LINEAR', value: 'GX RED LINEAR' },
  { text: 'KAILH PIXEL L', value: 'KAILH PIXEL L' },
  { text: 'KAILH PIXEL T', value: 'KAILH PIXEL T' },
  { text: 'TACTILE SWITCH', value: 'TACTILE SWITCH' },
]

const Color = [
  
  { text: 'WHITE', value: 'WHITE' },
  { text: 'BLACK', value: 'BLACK' },
  { text: 'PINK', value: 'PINK' },
  { text: 'GRAY', value: 'GRAY' },
  { text: 'PURPLE', value: 'PURPLE' },
  { text: 'LAVENDER', value: 'LAVENDER' },
  { text: 'RED WINE', value: 'RED WINE' },
  { text: 'BLACK/GRAY', value: 'BLACK/GRAY' },
  { text: 'CANVAS', value: 'CANVAS' },
  { text: 'PALETTE', value: 'PALETTE' },
  { text: 'WHITE NIGHT', value: 'WHITE NIGHT' },
  { text: 'WHITE ICE', value: 'WHITE ICE' },
  { text: 'BLACK SLATE', value: 'BLACK SLATE' },
  { text: 'BLACK&CYAN', value: 'BLACK&CYAN' },
  { text: 'GATERON YELLOW PRO', value: 'GATERON YELLOW PRO' },
  { text: 'KAILH BOX WHITE', value: 'KAILH BOX WHITE' },
  { text: 'GRAPHITE GRAY', value: 'GRAPHITE GRAY' },
  { text: 'CEMENT GRAY', value: 'CEMENT GRAY' },
  { text: 'MECHANICAL GREY', value: 'MECHANICAL GREY' },
  { text: 'WHITE CASE/STEEL PLATE', value: 'WHITE CASE/STEEL PLATE' },
]

const Type = [
  { text: 'Wired', value: 'Wired' },
  { text: 'Wireless', value: 'Wireless' },
  { text: 'Bluetooth', value: 'Bluetooth' },
  { text: 'Wired/Barebone', value: 'Wired/Barebone' },
  { text: 'Wireless/Wire', value: 'Wireless/Wire' },
  { text: 'Wireless/Bluetooth/Wired', value: 'Wireless/Bluetooth/Wired' },
]

const Group = [
  { text: 'FULL SIZE 100%', value: 'FULL SIZE 100%' },
  { text: 'TKL 80%', value: 'TKL 80%' },
  { text: '98%', value: '98%' },
  { text: '96%', value: '96%' },
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
    setSwitchValue(record.kb_status === "Y")
    setFileList([{ url: record.kb_img }])
    form.setFieldsValue({
      sw: record.kb_switch,
      color: record.kb_color,
      brand: record.kb_brand,
      group: record.kb_group,
      connect: record.kb_connect,
      model: record.kb_model,
      price_srp: record.kb_price_srp,
      discount: record.kb_discount,
      href: record.kb_href,
      status: record.kb_status,
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
    formData.append('upload_preset', 'swgxajch');

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
          axios.put(API_URL + '/update_img_kb/' + record.kb_id, { imageUrl })
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
            <Form.Item label="Switch" name="sw">
              <Select placeholder="Switch" allowClear>
                {SW.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Color" allowClear>
                {Color.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Type" name="connect">
              <Select placeholder="Color" allowClear>
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
      .get(API_URL + "/admin_data_kb")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
      .put(API_URL + "/update_stock_kb")
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
      .delete(API_URL + `/admin_del_kb/${id}`)
      .then(res => {
        setData(data.filter(item => item.kb_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_kb/' + record.kb_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL + '/admin_data_kb')
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
    const target = newData.find((item) => item.kb_id === key);
    if (target) {
      target.kb_status = target.kb_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status_kb/' + key, { status: target.kb_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL + '/admin_data_kb')
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
      dataIndex: 'kb_img',
      key: 'kb_img',
      width: 60,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'kb_brand', key: 'kb_brand', width: 100,
      render: (text, record) => <a href={record.kb_href} target='_blank'>{text}</a>,
      
      filters: Brand,
      onFilter: (value, record) => record.kb_brand.indexOf(value) === 0,
      sorter: (a, b) => a.kb_brand.localeCompare(b.kb_brand),
      sortDirections: ['descend'],
      
    },
    {
      title: 'Model', dataIndex: 'kb_model', key: 'kb_model',
    },
    
    {
      title: 'Switch', dataIndex: 'kb_switch', key: 'kb_switch', align: 'center',
    },
    {
      title: 'Color', dataIndex: 'kb_color', key: 'kb_color', align: 'center',
    },
    {
      title: 'Type', dataIndex: 'kb_connect', key: 'kb_connect', align: 'center',
      filters: Type,
      onFilter: (value, record) => record.kb_connect.indexOf(value) === 0,
    },
    {
      title: 'Group', dataIndex: 'kb_group', key: 'kb_group', align: 'center',
      filters: Group,
      onFilter: (value, record) => record.kb_group.indexOf(value) === 0,
    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'kb_stock_nny', key: 'kb_stock_nny', align: 'center',
          sorter: (a, b) => a.kb_stock_nny - b.kb_stock_nny,
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
          title: 'รามอินทรา', dataIndex: 'kb_stock_ramintra', key: 'kb_stock_ramintra', align: 'center',
          sorter: (a, b) => a.kb_stock_ramintra - b.kb_stock_ramintra,
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
          title: 'บางพลัด', dataIndex: 'kb_stock_bangphlat', key: 'kb_stock_bangphlat', align: 'center',
          sorter: (a, b) => a.kb_stock_bangphlat - b.kb_stock_bangphlat,
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
          title: 'เดอะโฟล์ท', dataIndex: 'kb_stock_thefloat', key: 'kb_stock_thefloat', align: 'center',
          sorter: (a, b) => a.kb_stock_thefloat - b.kb_stock_thefloat,
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
          title: 'รังสิต', dataIndex: 'kb_stock_rangsit', key: 'kb_stock_rangsit', align: 'center',
          sorter: (a, b) => a.kb_stock_rangsit - b.kb_stock_rangsit,
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
          title: 'รวม', dataIndex: 'kb_stock_sum', key: 'kb_stock_sum', align: 'center', sorter: (a, b) => a.kb_stock_sum - b.kb_stock_sum,
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
      title: 'Price SRP', dataIndex: 'kb_price_srp', key: 'kb_price_srp', align: 'right',
      sorter: (a, b) => a.kb_price_srp - b.kb_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Discount', dataIndex: 'kb_discount', key: 'kb_discount', align: 'right',
      sorter: (a, b) => a.kb_discount - b.kb_discount,
      render: (value) => (
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'kb_status', key: 'kb_status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.kb_status === 'Y'} onChange={() => handleStatusChange(record.kb_id)}
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
            onConfirm={() => handleDelete(record.kb_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.kb_id} pagination={pagination} onChange={onChange} bordered size="small"
      
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