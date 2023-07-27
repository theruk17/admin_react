import { Layout, Menu, theme } from 'antd';
import React from 'react';
import PageContent from '../components/PageContent'
import '../index.css';
import LogoIHC from '../assets/logo_ihc.svg'
import { useNavigate } from 'react-router-dom';
import { HouseDoor, ArrowRepeat, Laptop, Display, Pc, Fan, Headset, Keyboard, Mouse2, Mic, SquareFill, Snow, FileEarmark } from 'react-bootstrap-icons';
const { Header, Content, Sider, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()
  return (
    <Layout hasSider>
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
              icon: <FileEarmark />,
              label: "Chair",
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
              label: "SINK",
              key: '/sink'
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="header" style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}>
          <img className='logo' src={LogoIHC} alt="" style={{
            width: 140,
          }} />
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
        <Content
          style={{
            width: '90%',
            padding: 10,
            top: 10,
            margin: '60px 170px 0',
            minHeight: '100dvh',
            background: colorBgContainer,
          }}
        >
          <PageContent />

        </Content>
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
export default App;