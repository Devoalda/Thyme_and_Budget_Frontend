import React, {useEffect, useState} from 'react';
import { Typography, Button, Row, Col } from 'antd';
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
  const [isChatOpen, setIsChatOpen] = useState(false);

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