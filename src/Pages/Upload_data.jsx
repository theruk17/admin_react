import { RedoOutlined } from '@ant-design/icons';
import { message, Card, Space, Button, Progress } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import 'dotenv/config'
require('dotenv').config()


const API_URL = process.env.API_URL

const Upload_data = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncData = async () => {
    try {
      setLoading(true)
      await axios.get(API_URL + '/getdatasheet')
        .then(res => {
          if (res.data != '') {
            setProgress(100);
            setLoading(false)
            message.success(res.data);
          }

        })
    } catch (error) {
      message.error(error);
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
      </Card>
    </Space>
  )


}
export default Upload_data;