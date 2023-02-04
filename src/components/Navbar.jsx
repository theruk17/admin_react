import { LaptopOutlined, NotificationOutlined, DesktopOutlined, CloudUploadOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
import PageContent from '../components/PageContent'
import '../index.css';
import LogoIHC from '../assets/logo_ihc.svg'
import { useNavigate } from 'react-router-dom';
const { Header, Content, Sider, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()
  return (
    <Layout>
      <Header className="header" style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}>
        <img className='logo' src={LogoIHC} alt="" style={{
          width: 140,
        }} />
        <Menu theme="dark" mode="horizontal"  defaultSelectedKeys={['1']}
        onClick={(item) => {
          navigate(item.key);
        }}
        items={[
          {
            icon: <HomeOutlined />,
            label: "HOME",
            key:'/'
          },
         /*  {
            icon: <CloudUploadOutlined />,
            label: "UPLOAD",
            key:'/upload'
          },
          {
            icon: <CloudUploadOutlined />,
            label: "UPLOAD CASE",
            key:'/upload_case'
          } */
        ]} />
      </Header>
      <Layout>
        <Sider
          breakpoint='lg'
          collapsedWidth='0'
          width={200}
          style={{
            background: colorBgContainer,
            
          }}
        >
          <Menu
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
                icon: <DesktopOutlined />,
                label: "Monitor",
                key:'/monitor'
              },
              {
                icon: <CloudUploadOutlined />,
                label: "Case",
                key:'/case'
              }
            ]}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            margin: '16px 0',
          }}
        >
          
          <Content
            style={{
              
              padding: 24,
              margin: 0,
              minHeight: '75vh',
              height: '100%',
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
    </Layout>
  );
};
export default App;