import { RedoOutlined } from '@ant-design/icons';
import { notification, Card, Space, Button, Progress } from 'antd';
import axios from 'axios';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL

const Upload_data = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progress2, setProgress2] = useState(0);

  const syncData = async () => {

    setLoading(true)
    await axios.get(API_URL + '/getdatasheet')
      .then(res => {
        if (res.data != '') {
          setProgress(100);
          setLoading(false)
          notification.success({
            message: 'Successful',
            description: res.data.message,
          });
        }

      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.response.data.message.code,
        });
      })


  }

  const syncdataadmin = async () => {
    try {
      setLoading2(true)
      await axios.put(API_URL + '/syncItechtoAdmin')
        .then(res => {
          if (res.status === 200) {
            setProgress2(100);
            setLoading2(false)
            axios.put(API_URL + '/update_stock')
              .then(res => {
                notification.success({
                  message: 'Successful',
                  description: res.data,
                });
              })
            axios.get(API_URL + '/getpricefromsheet')
              .then(res => {
                notification.success({
                  message: 'Successful',
                  description: res.data,
                });
              })
            notification.success({
              message: 'Successful',
              description: res.data.message,
            });
          }

        })
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.response.data.message.code,
      });
    }

  }

  return (
    <Space direction="vertical" size={16}>
      <Card
        title="Sync data from google sheet"
        style={{
          width: 500,
        }}
      >
        <Button type="primary" shape="round" icon={<RedoOutlined />} size='large' onClick={syncData} loading={loading} block>Sync</Button>
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
        />
        <p style={{ color: 'red' }}>* ดึงข้อมูลชื่อและรายละเอียดสินค้าจาก Excel เท่านั้น</p>
      </Card>
      <Card
        title="ซิงค์ข้อมูลจาก Itech"

        style={{
          width: 500,
        }}
      >
        <Button type="primary" shape="round" icon={<RedoOutlined />} size='large' onClick={syncdataadmin} loading={loading2} block>Sync</Button>
        <Progress
          percent={progress2}
          status="active"
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
        />
        <p style={{ color: 'red' }}>* ดึงข้อมูลราคาและจำนวนสต็อกสินค้าจาก iTech เท่านั้น</p>
      </Card>
    </Space>
  )


}
export default Upload_data;