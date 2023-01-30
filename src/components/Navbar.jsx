import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar } from 'antd';
import React from 'react';
import ShowData from './ShowData'
import '../index.css';
import LogoIHC from '../assets/logo_ihc.svg'
const { Header, Content, Sider, Footer } = Layout;
const items1 = ['Home', 'Upload Excel', 'Test2'].map((key) => ({
  key,
  label: `${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Home']} items={items1} />
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
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{

              padding: 24,
              margin: 0,
              minHeight: '75vh',
              height: '100%',
              background: colorBgContainer,
            }}
          >
            <ShowData />

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