import { useEffect, useState } from 'react'
import axios from 'axios'
import { NumericFormat } from 'react-number-format';
import reactLogo from '../assets/react.svg'
import { Space, Table, Tag } from 'antd';
import '../App.css'

const API_URL = 'https://drab-jade-haddock-toga.cyclic.app/monitor'



function Data() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    axios.get(API_URL)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
  }, []);

  const columns = [
    {
      title: 'Brand', dataIndex: 'mnt_brand', key: 'mnt_brand',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Model', dataIndex: 'mnt_model', key: 'mnt_model',
    },
    {
      title: 'Size', dataIndex: 'mnt_size', key: 'mnt_size',
      render: (text) => <p>{text}"</p>,
    },
    {
      title: 'Refresh Rate', dataIndex: 'mnt_refresh_rate', key: 'mnt_refresh_rate',
      render: (text) => <p>{text}Hz</p>,
    },
    {
      title: 'Panel', dataIndex: 'mnt_panel', key: 'mnt_panel',
    },
    {
      title: 'Resolution', dataIndex: 'mnt_resolution', key: 'mnt_resolution',
    },
    {
      title: 'Curve', dataIndex: 'mnt_curve', key: 'mnt_curve',
    },
    {
      title: 'Status', dataIndex: 'mnt_status', key: 'mnt_status',
    },
    {
      title: 'SRP', dataIndex: 'mnt_price_srp', key: 'mnt_price_srp',
      render: (value) => (
        <NumericFormat value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/>
      )
    },
    {
      title: 'Price', dataIndex: 'mnt_price_w_com', key: 'mnt_price_w_com',
      render: (value) => (
        <NumericFormat value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/>
      )
    },
    
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
      <Table columns={columns} dataSource={data} rowKey={record => record.mnt_id} />
  )
}

export default Data
