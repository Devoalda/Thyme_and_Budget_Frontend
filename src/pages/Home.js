import React, { useState } from 'react';
import { Typography, Button, Row, Col, Modal } from 'antd';
import LayoutComponent from '../components/Layout'; 
import { Link } from 'react-router-dom'; 

const { Title, Paragraph } = Typography;

const Home = () => {
  const [isAboutUsModalVisible, setAboutUsModalVisible] = useState(false);

  const showAboutUsModal = () => {
    setAboutUsModalVisible(true);
  };

  const handleAboutUsOk = () => {
    setAboutUsModalVisible(false);
  };

  const handleAboutUsCancel = () => {
    setAboutUsModalVisible(false);
  };

  return (
    <LayoutComponent>
      <Title level={1} style={{ marginTop: '40px', textAlign: 'center' }}>Fighting Food Hunger Together</Title>
      <Paragraph style={{ fontSize: '18px', textAlign: 'center' }}>
        Join our mission to combat food hunger. Your food donations can make a
        huge difference in the lives of those struggling with poverty and hunger.
      </Paragraph>
      <Row gutter={[16, 24]} justify="center" style={{ marginBottom: '40px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Donate Food</Title>
          <Paragraph>
            Have extra food? Your donations are valuable to us. Share your food
            and help us move closer to zero hunger.
          </Paragraph>
          <Button type="primary" size="large"><Link to="/newfooditem">Donate Now</Link></Button>
        </Col>
        <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
          <Title level={3}>Learn More</Title>
          <Paragraph>
            Discover more about our work and the impact of your contributions
            on the community.
          </Paragraph>
          <Button type = "primary" size="large" onClick={showAboutUsModal}>About Us</Button>
          <Modal
            title="About Us"
            visible={isAboutUsModalVisible}
            onOk={handleAboutUsOk}
            onCancel={handleAboutUsCancel}
            footer={[
            <Button key="back" onClick={handleAboutUsCancel}>
                Close
            </Button>
            ]}
        >
            <p>We are a group of SIT Students that wants to help the society to reduce zero hunger.</p>
            <p>Location: We are situated at 172 Ang Mo Kio Ave 8, Singapore 567739</p>
            <p>Contact details: thymeandbudget@sit.singaporetech.edu.sg</p>
        </Modal>
        </Col>
      </Row>
    </LayoutComponent>
  );
};

export default Home;