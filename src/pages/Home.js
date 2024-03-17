import React, { useState } from 'react';
import { Typography, Button, Row, Col, Modal, App } from 'antd';
import LayoutComponent from '../components/Layout'; 
import { Link } from 'react-router-dom'; 
import AboutUsModal from './AboutUsModal';
import '../App.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <LayoutComponent>
      <Title level={1} style={{ marginTop: '40px', textAlign: 'center' }}>
        Fighting Food Hunger Together
      </Title>
      <Paragraph style={{ fontSize: '18px', textAlign: 'center' }}>
        Join our mission to combat food hunger. Your food donations can make a
        huge difference in the lives of those struggling with poverty and hunger.
      </Paragraph>
      <Row gutter={[16, 24]} justify="center" style={{ marginBottom: '40px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
        <div className="image-wrapper">
          <img 
            className="image-fixed-size"
            src={`${process.env.PUBLIC_URL}/images/hungry.jpg`} 
            alt="Hungry" 
          />
        </div>
          <Title level={2}>Donate Food</Title>
          <Paragraph style={{ fontSize: '18px' }}>
              Have extra food? Your donations are valuable to us. Share your food
              and help us move closer to zero hunger.
          </Paragraph>
          <div className="image-wrapper">
            <img 
              className="image-fixed-size"
              src={`${process.env.PUBLIC_URL}/images/donate.jpg`} 
              alt="Donate" 
            />
          </div>
          <Button type="primary" size="large">
            <Link to="/newfooditem">Donate Now</Link>
          </Button>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Learn More</Title>
          <Paragraph style = {{ fontSize: '18px' }}>
            Discover more about our work and the impact of your contributions
            on the community.
          </Paragraph>
          <AboutUsModal />
        </Col>
      </Row>
    </LayoutComponent>
  );
};

export default Home;