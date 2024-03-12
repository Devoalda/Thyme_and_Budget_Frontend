import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, AppstoreOutlined, PlusSquareOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Header from './Header';

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
    overflow: 'auto',
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

export default function LayoutComponent({ children }) {
    return (
      <Layout style={layoutStyle}>
        <Sider style={siderStyle} width={200}>
          <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={logoStyle} />
          </div>
          <Menu mode="inline" style={menuStyle} defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined style={iconStyle} />} style={menuItemStyle}>
                <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreOutlined style={iconStyle} />} style={menuItemStyle}>
                <Link to="/myfooditems">My Food Items</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<PlusSquareOutlined style={iconStyle} />} style={menuItemStyle}>
                <Link to="/newfooditem">New Food Item</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined style={iconStyle} />} style={menuItemStyle}>
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<LogoutOutlined style={iconStyle} />} style={menuItemStyle}>
                <Link to="/logout">Logout</Link>
            </Menu.Item>
           </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
            <Content style={contentStyle}>
                <div style={{ textAlign: 'center' }}>
                {children}
                </div>
            </Content>
            <Footer style={footerStyle}>
                Thyme & Budget ©2024 Created by Team 15
            </Footer>
        </Layout>
      </Layout>
    );
}
