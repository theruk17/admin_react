// ** React Imports
import React, { useState } from 'react'

// ** Axios Imports
import axios from 'axios';

// ** Ant Design Imports
import { Card, Button, Form, Input, Divider, notification } from 'antd';

// ** Ant Icon Imports
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// ** React Router Imports
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../provider/authProvider";

import LOGO from '../assets/logo_ihc_b.svg'

// ** API URL
const API_URL = import.meta.env.VITE_API_URL

const Login = () => {
    // ** States
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [loading, setLoading] = useState(false);


    const onFinish = async (values) => {
        setLoading(true)
        await axios.post(API_URL + '/auth/login', values)
            .then(res => {
                setToken(res.data.accessToken)
                setLoading(false)
                navigate("/", { replace: true });
            })
            .catch(async err => {
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                });
                setLoading(false)
            });
    };
    return (
        <div style={{ backgroundColor: '#262626', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Card
                bordered={false}
                style={{
                    width: 450,
                    padding: 30,
                    minHeight: 500,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', }}>
                    <img src={LOGO} width={200} ></img>
                </div>
                <Divider />
                <Form
                    layout='vertical'
                    requiredMark={false}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="username" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="············" prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <Button size='large' type="primary" htmlType="submit" block loading={loading}>
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login