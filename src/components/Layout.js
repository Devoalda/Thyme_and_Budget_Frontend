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
    maxWidth: '70%', // Limits the logo width relative to its container
    height: 'auto', // Keeps the aspect ratio of the image
    margin: '0 auto 16px', // Added margin to the bottom for spacing
  };

  const siderStyle = {
    background: '#D9E8F5', 
    boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden', // This prevents scrolling in the sidebar
  };

  const menuItemStyle = {
    color: '#333', // Changed to a darker color for better contrast
    fontSize: '16px',
  };
  
  const iconStyle = {
    fontSize: '18px', // you can adjust the size as needed
    color: '#333', // same color as the text for consistency
  };
  
  const menuStyle = {
    background: 'none',
    borderRight: 'none',
  };

// export default function LayoutComponent({ children }) {
//   return (
//     <Layout style={layoutStyle}>
//       <Sider style={siderStyle} width={250}>
//         <div className="logo" style={{ padding: '16px', textAlign: 'center', background: '#f0f2f5', }}>
//           <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={logoStyle} />
//           <h1>Thyme and Budget</h1>
//         </div>
//         <Header />
//       </Sider>
//       <Layout style={{ marginLeft: 250 }}> {/* This value should be equal to the Sider's width */}
//         <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
//           <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
//             {children}
//           </div>
//         </Content>
//         <Footer style={footerStyle}>
//           Thyme & Budget ©2024 Created by Team 15
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// }

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
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, textAlign: 'center' }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Thyme & Budget ©2024 Created by Team 15
          </Footer>
        </Layout>
      </Layout>
    );
}
