import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tooltip } from 'antd';
import 'dotenv/config'
import '../App.css';

const API_URL = process.env.API_URL

const Brand = [
  { val: 'ACER' },
  { val: 'ASUS' },
  { val: 'DELL' },
  { val: 'HP' },
  { val: 'LENOVO' },
  { val: 'MSI' },
]

const Color = [
  { val: '(BLACK)' },
  { val: '(BONFIRE BLACK)' },
  { val: '(CLASSIC BLACK)' },
  { val: '(MIDNIGHT BLACK)' },
  { val: '(OBSIDIAN BLACK)' },
  { val: '(OFF BLACK)' },
  { val: '(SHADOW BLACK)' },
  { val: '(GRAPHITE BLACK)' },
  { val: '(INDIE BLACK)' },
  { val: '(CARBON BLACK)' },
  { val: '(MIXED BLACK)' },
  { val: '(ARCTIC GREY)' },
  { val: '(PLATINUM GREY)' },
  { val: '(TITAN GREY)' },
  { val: '(STORM GREY)' },
  { val: '(ONYX GREY)' },
  { val: '(SLATE GREY)' },
  { val: '(STELLAR GRAY)' },
  { val: '(MECHA GRAY)' },
  { val: '(ECLIPSE GRAY)' },
  { val: '(DARK SHADOW GREY)' },
  { val: '(SPRUCE BLUE)' },
  { val: '(QUIET BLUE)' },
  { val: '(PERFOMANCE BLUE)' },
  { val: '(MICA SILVER)' },
  { val: '(NATURAL SILVER)' },
  { val: '(PLATINUM SILVER)' },
  { val: '(SPECTER GREEN WITH CAMOUFLAG)' },



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
    setFileList([{ url: record.nb_img }])
    form.setFieldsValue({
      group: record.nb_group,
      brand: record.nb_brand,
      model: record.nb_model,
      color: record.nb_color,
      price_srp: record.nb_price_srp,
      dis_price: record.nb_dis_price,
      href: record.nb_href,
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
          axios.put(API_URL + '/update_img_nb/' + record.nb_id, { imageUrl })
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
            <Form.Item label="Discount" name="dis_price">
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

const NbData = () => {
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
      .get(API_URL + "/admin_data_nb")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
    axios
      .put(API_URL + "/update_stock_nb")
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
      .delete(API_URL + `/admin_del_nb/${id}`)
      .then(res => {
        setData(data.filter(item => item.nb_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_nb/' + record.nb_id, values)
      .then(res => {
        message.success(res.data);
        axios.get(API_URL + '/admin_data_nb')
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
      axios.put(API_URL + '/edit_status_nb/' + key, { status: target.nb_status })
        .then(res => {
          message.success(res.data);
          axios.get(API_URL + '/admin_data_nb')
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
      dataIndex: 'nb_img',
      key: 'nb_img',
      width: 60,
      align: 'center',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'nb_brand', key: 'nb_brand',
      width: 80,
      render: (text, record) => <a href={record.nb_href} target='_blank'>{text}</a>,
      filters: [
        {
          text: 'ACER',
          value: 'ACER',
        },
        {
          text: 'ASUS',
          value: 'ASUS',
        },
        {
          text: 'DELL',
          value: 'DELL',
        },
        {
          text: 'HP',
          value: 'HP',
        },
        {
          text: 'LENOVO',
          value: 'LENOVO',
        },
        {
          text: 'MSI',
          value: 'MSI',
        },


      ],
      onFilter: (value, record) => record.nb_brand.indexOf(value) === 0,
      sorter: (a, b) => a.nb_brand.localeCompare(b.nb_brand),
      sortDirections: ['descend'],
    },
    {
      title: 'Model', dataIndex: 'nb_model', key: 'nb_model', width: 400,
    },
    {
      title: 'Color', dataIndex: 'nb_color', key: 'nb_color', width: 190,
    },

    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'nb_stock_nny', key: 'nb_stock_nny', align: 'center',
          sorter: (a, b) => a.nb_stock_nny - b.nb_stock_nny,
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
          title: 'รามอินทรา', dataIndex: 'nb_stock_ramintra', key: 'nb_stock_ramintra', align: 'center',
          sorter: (a, b) => a.nb_stock_ramintra - b.nb_stock_ramintra,
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
          title: 'บางพลัด', dataIndex: 'nb_stock_bangphlat', key: 'nb_stock_bangphlat', align: 'center',
          sorter: (a, b) => a.nb_stock_bangphlat - b.nb_stock_bangphlat,
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
          title: 'เดอะโฟล์ท', dataIndex: 'nb_stock_thefloat', key: 'nb_stock_thefloat', align: 'center',
          sorter: (a, b) => a.nb_stock_thefloat - b.nb_stock_thefloat,
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
          title: 'รังสิต', dataIndex: 'nb_stock_rangsit', key: 'nb_stock_rangsit', align: 'center',
          sorter: (a, b) => a.nb_stock_rangsit - b.nb_stock_rangsit,
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
          title: 'รวม', dataIndex: 'nb_stock_sum', key: 'nb_stock_sum', align: 'center', sorter: (a, b) => a.nb_stock_sum - b.nb_stock_sum,
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
      title: 'Price SRP', dataIndex: 'nb_price_srp', key: 'nb_price_srp', align: 'right',
      sorter: (a, b) => a.nb_price_srp - b.nb_price_srp,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Discount', dataIndex: 'nb_dis_price', key: 'nb_dis_price', align: 'right',
      sorter: (a, b) => a.nb_dis_price - b.nb_dis_price,
      render: (value) => (
        <NumericFormat style={{ color: "#d4001a" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'case_status', key: 'case_status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.nb_status === 'Y'} onChange={() => handleStatusChange(record.nb_id)}
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.nb_id} pagination={pagination} onChange={onChange} bordered size="small"
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
              }}
            >
              {record.nb_size} {record.nb_hz} {record.nb_cpu} {record.nb_vga} {record.nb_ram} {record.nb_storage} {record.nb_os}
            </p>
          ),

        }}
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

export default NbData;