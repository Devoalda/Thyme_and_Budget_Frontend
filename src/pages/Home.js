import React, {useEffect, useState} from 'react';
import { Typography, Button, Row, Col, Modal, App } from 'antd';
import LayoutComponent from '../components/Layout'; 
import {Link, redirect} from 'react-router-dom';
import AboutUsModal from './AboutUsModal';
import '../App.css';
import config from '../chatbot/config.js';
import MessageParser from '../chatbot/MessageParser.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import Chatbot from "react-chatbot-kit";
import '../css/chat.css';
import axios from "axios";

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

  const [isChatOpen, setIsChatOpen] = useState(false);
    // const [role, setRole] = useState('');
    //
    // useEffect(() => {
    //     axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })
    //         .then(response => {
    //             setRole(response.data.role);
    //         })
    //         .catch(error => {
    //             console.error('Error getting user status:', error);
    //             redirect('/login')
    //         });
    // }, []);

  return (
      <LayoutComponent>
        <Title level={1} style={{marginTop: '40px', textAlign: 'center'}}>Fighting Food Hunger Together</Title>
        <Paragraph style={{fontSize: '18px', textAlign: 'center'}}>
          Join our mission to combat food hunger. Your food donations can make a
          huge difference in the lives of those struggling with poverty and hunger.
        </Paragraph>
        <Row gutter={[16, 24]} justify="center" style={{marginBottom: '40px'}}>
          <Col span={24} style={{textAlign: 'center'}}>
            <Title level={3}>Donate Food</Title>
            <Paragraph>
              Have extra food? Your donations are valuable to us. Share your food
              and help us move closer to zero hunger.
            </Paragraph>
            <Button type="primary" size="large"><Link to="/newfooditem">Donate Now</Link></Button>
          </Col>
          <Col span={24} style={{textAlign: 'center', marginTop: '20px'}}>
            <Title level={3}>Learn More</Title>
            <Paragraph>
              Discover more about our work and the impact of your contributions
              on the community.
            </Paragraph>
            <Button type="primary" size="large" onClick={showAboutUsModal}>About Us</Button>
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
        <div className={`chat-container ${isChatOpen ? 'open' : ''}`}
             onClick={() => !isChatOpen && setIsChatOpen(true)}>
          {isChatOpen && (
              <>
                <button className="close-button" onClick={(event) => {
                  event.stopPropagation();
                  setIsChatOpen(false);
                }}>X
                </button>
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                />
              </>
          )}
        </div>
      </LayoutComponent>
  );
};

export default Home;