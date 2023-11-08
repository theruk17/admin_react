import { Layout, Menu, theme, Space, Badge, Avatar, Drawer, Divider, Button, Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react';
import PageContent from '../components/PageContent'
import '../index.css';
import LogoIHC from '../assets/logo_ihc.svg'
import { useNavigate } from 'react-router-dom';
import { HouseDoor, ArrowRepeat, Laptop, Display, Pc, Fan, Headset, Keyboard, Mouse2, Mic, SquareFill, Snow, FileEarmark, KeyboardFill, BellFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { useAuth } from "../provider/authProvider";

const { Header, Content, Sider, Footer } = Layout;

const API_URL = import.meta.env.VITE_API_URL

const Navbar = () => {
  const { setToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(API_URL + '/new_stock')
      .then((res) => {
        setData(res.data)
        setCount(res.data.length)

      })

  }, [])

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const items = [
    {
      label: 'เปลี่ยนรหัสผ่าน',
      icon: <KeyOutlined />,
      disabled: true,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: 'ออกจากระบบ',
      icon: <LogoutOutlined />,
      danger: true,
      key: '3',
    },
  ];

  const onClick = ({ key }) => {
    if (key === '3') {
      setToken();
      navigate("/", { replace: true });
    }
  };

  return (
    <Layout hasSider
      style={{
        minHeight: '100vh',
        minWidth: '100vh'
      }}>

      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        width={170}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          top: 64,
          left: 0,
          zIndex: 99,
          background: colorBgContainer,

        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{
            height: '100%',
            borderRight: 0,

          }}
          onClick={(item) => {
            navigate(item.key);
          }}
          items={[
            {
              icon: <Display />,
              label: "Monitor",
              key: '/monitor'
            },
            {
              icon: <Pc />,
              label: "Case",
              key: '/case'
            },
            {
              icon: <Laptop />,
              label: "Notebook",
              key: '/nb'
            },
            {
              icon: <Snow />,
              label: "Liquid Cooling",
              key: '/lc'
            },
            {
              icon: <FileEarmark />,
              label: "SINK",
              key: '/sink'
            },
            {
              icon: <Fan />,
              label: "FAN",
              key: '/fan'
            },

            {
              icon: <Headset />,
              label: "HeadSet",
              key: '/headset'
            },
            {
              icon: <Keyboard />,
              label: "Keyboard",
              key: '/kb'
            },
            {
              icon: <KeyboardFill />,
              label: "KeyCap",
              key: '/kcap'
            },
            {
              icon: <FileEarmark />,
              label: "Chair/Desk",
              key: '/ch'
            },
            {
              icon: <Mouse2 />,
              label: "Mouse",
              key: '/mouse'
            },
            {
              icon: <SquareFill />,
              label: "Mousepad",
              key: '/mousepad'
            },
            {
              icon: <Mic />,
              label: "MIC",
              key: '/mic'
            },
            {
              icon: <FileEarmark />,
              label: "HOLDER",
              key: '/holder'
            },

          ]}
        />
      </Sider>

      <Layout>
        <Header className="header"
          style={{

            position: 'fixed',
            top: 0,
            zIndex: 99,
            width: '100%',
          }}>
          <img className='logo' src={LogoIHC} alt="" style={{
            width: 140,
          }} />
          <div style={{ float: 'right' }}>
            <Space size={24}>
              <Badge count={count} size="small">
                <Avatar style={{ cursor: 'pointer' }} shape="square" size="large" icon={<BellFill />} onClick={showDrawer} />
              </Badge>
              <Dropdown
                menu={{
                  items,
                  onClick
                }}
                trigger={['click']}
                placement="bottomRight"
                arrow
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar style={{
                    backgroundColor: '#87d068',
                  }} size={38} icon={<UserOutlined />} />
                </a>
              </Dropdown>
            </Space>

          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}
            onClick={(item) => {
              navigate(item.key);
            }}
            items={[
              {
                icon: <HouseDoor />,
                label: "HOME",
                key: '/'
              },
              {
                icon: <ArrowRepeat />,
                label: "SYNC DATA",
                key: '/upload'
              },
            ]} />
        </Header>
        <Layout
          style={{
            display: 'flex',
          }}>
          <Content
            style={{
              width: '90%',
              padding: 10,
              top: 10,
              margin: '60px 170px 0',
              background: colorBgContainer,
            }}
          >
            <Drawer size='large' title="สินค้าที่มี Stock เข้า (*ที่ยังไม่ได้เปิด)" placement="right" onClose={onClose} open={open} style={{ color: 'black', fontSize: 11 }}>
              {data.map((item) => (
                <>
                  <p key={item.productCode}>{item.productCode + ' - ' + item.productName}</p>
                  <Divider style={{ margin: 0 }} dashed />
                </>
              ))}

            </Drawer>
            <PageContent />

          </Content>
        </Layout>
        <Footer
          style={{
            textAlign: 'left',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Navbar;