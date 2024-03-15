import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  PlusSquareOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

const layoutStyle = {
  minHeight: '100vh',
};

const logoStyle = {
  maxWidth: '70%',
  height: 'auto',
  margin: '0 auto 16px',
};

const siderStyle = {
  background: '#D9E8F5',
  boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
  height: '100vh',
  position: 'fixed',
  overflow: 'hidden', // This prevents scrolling in the sidebar
};

const menuItemStyle = {
  color: '#333',
  fontSize: '16px',
};

const iconStyle = {
  fontSize: '18px',
  color: '#333',
};

const menuStyle = {
  background: 'none',
  borderRight: 'none',
};

const contentStyle = {
  flexGrow: 1,
  margin: '0',
  background: '#E6F4EA',
  padding: '24px 16px',
  overflow: 'auto',
};

const footerStyle = {
  background: '#CDEBD9',
  color: '#333',
  textAlign: 'center',
  padding: '12px 50px',
};

export default function LayoutComponent({ children, role }) {

  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);

  const handleMouseEnter = (key) => setHoveredMenuItem(key);

  const menuItemStyle = (key) => ({
    color: '#333',
    fontSize: '16px',
    backgroundColor: hoveredMenuItem === key ? '#f0f0f0' : 'transparent', // Adjust the background color for hover effect
  });

  // get role from local storage
  role = localStorage.getItem('role');
  console.log(role);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ background: '#D9E8F5', boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)', height: '100vh', position: 'fixed', overflow: 'hidden' }} width={200}>
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={{ maxWidth: '70%', height: 'auto', margin: '0 auto 16px' }} />
        </div>
        <Menu mode="inline" style={{ background: 'none', borderRight: 'none' }} defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />} style={menuItemStyle('1')} onMouseEnter={() => handleMouseEnter('1')}>
            <Link to={role === 'superuser' ? "/admin" : "/"}>Home</Link>
          </Menu.Item>

          {role && role !== 'superuser' && (
            <>
              <Menu.Item key="2" icon={<ShopOutlined />} style={menuItemStyle('2')} onMouseEnter={() => handleMouseEnter('2')}>
                <Link to="/viewfooditems">View Food Items</Link>
              </Menu.Item>

            </>
          )}
          {role === 'donor' && (
            <>
              <Menu.Item key="3" icon={<AppstoreOutlined />} style={menuItemStyle('3')} onMouseEnter={() => handleMouseEnter('3')}>
                <Link to="/myfooditems">My Food Items</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<PlusSquareOutlined />} style={menuItemStyle('4')} onMouseEnter={() => handleMouseEnter('4')}>
                <Link to="/newfooditem">New Food Item</Link>
              </Menu.Item>
            </>

          )}
          {role && role !== 'superuser' && (
            <Menu.Item key="5" icon={<UserOutlined />} style={menuItemStyle('5')} onMouseEnter={() => handleMouseEnter('5')}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
          )}
          {role ? (
            <Menu.Item key="logout" icon={<LogoutOutlined />} style={menuItemStyle}>
              <Link to="/logout">Logout</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="login" icon={<LoginOutlined />} style={menuItemStyle}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ flexGrow: 1, margin: '0', background: '#E6F4EA', padding: '24px 16px', overflow: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ background: '#CDEBD9', color: '#333', textAlign: 'center', padding: '12px 50px' }}>
          Thyme & Budget ©2024 Created by Team 15
        </Footer>
      </Layout>
    </Layout>
  );
}