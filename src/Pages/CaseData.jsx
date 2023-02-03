import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm,Tag } from 'antd';
import '../App.css';

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app/admin_data_case';

const Brand = [
  { val: 'AOC' },
  { val: 'MSI' },
  { val: 'LENOVO' },
  { val: 'LG' },
  { val: 'DELL' },
  { val: 'ASUS' },
  { val: 'BENQ' },
  { val: 'ACER' },
  { val: 'SAMSUNG' },
  { val: 'GIGABYTE' },
  { val: 'COOLER MASTER' }
]

const Color = [
  { val: '(BLACK)' },
  { val: '(WHITE)' },
  { val: '(SNOW WHITE)' },
  { val: '24' },
  { val: '24.5' },
  { val: '27' },
  { val: '28' },
  { val: '31.5' },
  { val: '32' },
  { val: '34' }
]


const Group = [
  { val: '1' ,label: '21.5" 75Hz'},
  { val: '2', label: '24" 75Hz - 100Hz' },
  { val: '3', label: '24" 144Hz' },
  { val: '4', label: '24" 165Hz' },
  { val: '5', label: '27" 75Hz' },
  { val: '6', label: '27" 75Hz 2K' },
  { val: '7', label: '27" 144Hz' },
  { val: '8', label: '27" 165Hz - 170Hz' },
  { val: '9', label: '27" 165Hz 2K' },
  { val: '10', label: '27" 240Hz' },
  { val: '11', label: '27" - 28" 60Hz 4K' },
  { val: '12', label: '31.5" 75Hz - 165Hz' },
  { val: '13', label: '31.5" 75Hz 2K' },
  { val: '14', label: '32" 144Hz - 165Hz 2K' },
  { val: '15', label: '32" 240Hz' },
  { val: '16', label: '34" 144Hz' },
  { val: '17', label: '34" 144Hz 2K' }
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
  const [fileList, setFileList] = useState(['']);

  useEffect(() => {
    setSwitchValue(record.case_status === "Y")
    setFileList([{url:record.case_img,status: 'done'}])
    form.setFieldsValue({
      group: record.case_group,
      brand: record.case_brand,
      model: record.case_model,
      color: record.case_color,
      price_srp: record.case_price_srp,
      status: record.case_status,
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

  /* const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  }; */
  
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'xwsut1mj');
  
    try {
      await axios.post('https://api.cloudinary.com/v1_1/drllzqbk0/image/upload', formData)
      .then(res => {
        console.log(res);
        const imageUrl = res.data.secure_url;
        message.success("Upload Image to Cloud Server "+res.statusText);
      axios.put('https://drab-jade-haddock-toga.cyclic.app/update_img_case/'+record.case_id, { imageUrl })
      .then(res => {
        message.success(res.data);
        })
      })
    
    } catch (error) {
      console.error(error);
      message.error('Image upload failed!');
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
              <Select placeholder="Size" allowClear>
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
            <Form.Item label="Price" name="price_srp">
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

        <Form.Item label="Upload Image" name='file'>
          <Upload listType="picture-card"
            fileList={fileList}
            customRequest={handleUpload}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={true}
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
      .get(API_URL)
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
      .delete(`https://drab-jade-haddock-toga.cyclic.app/admin_del_case/${id}`)
      .then(res => {
        setData(data.filter(item => item.case_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put('https://drab-jade-haddock-toga.cyclic.app/edit_case/' + record.case_id, values)
      .then(res => {
        message.success(res.data);
        axios.get('https://drab-jade-haddock-toga.cyclic.app/admin_data_case')
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
    const target = newData.find((item) => item.case_id === key);
    if (target) {
      target.case_status = target.case_status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put('https://drab-jade-haddock-toga.cyclic.app/edit_status_case/' + key, { status: target.case_status })
      .then(res => {
        message.success(res.data);
        axios.get('https://drab-jade-haddock-toga.cyclic.app/admin_data_case')
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
      title: 'SN', dataIndex: 'case_id', key: 'case_id',
    },
    {
      title: 'Image',
      dataIndex: 'case_img',
      key: 'case_img',
      render: (imageUrl) => <img src={imageUrl} alt="thumbnail" width="30" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'case_brand', key: 'case_brand', 
      render: (text, record) => <a href={record.mnt_href} target='_blank'>{text}</a>,
      
    },
    {
      title: 'Model', dataIndex: 'case_model', key: 'case_model',
    },
    {
      title: 'Color', dataIndex: 'case_color', key: 'case_color',
      sorter: (a, b) => a.case_color - b.case_color ,
      
    },
    {
      title: 'Status', dataIndex: 'case_status', key: 'case_status',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.mnt_status === 'Y'} onChange={() => handleStatusChange(record.case_id)}
        />
      )
    },
    {
      title: 'Price SRP', dataIndex: 'case_price_srp', key: 'case_price_srp',
      sorter: (a, b) => a.case_price_srp - b.case_price_srp ,
      render: (value) => (
        <NumericFormat style={{color: "#0958d9"}} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },

    {
      title: 'Action', dataIndex: 'action', key: 'action',
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
      <Table loading={loading} dataSource={data} columns={Column} rowKey={record => record.case_id} pagination={pagination} onChange={onChange}></Table>
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