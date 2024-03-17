import React, { useState } from 'react';
import { Modal, Button, Typography } from 'antd';
const { Text, Link } = Typography;

const AboutUsModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" size="large" onClick={showModal}>
        About Us
      </Button>
      <Modal
        title="About Thyme and Budget"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        ]}
        bodyStyle={{ padding: '20px' }} 
        style={{ top: 20 }} 
      >
        <Typography>
          <p>
            <Text strong>We are a group of SIT Students</Text> passionate about reducing hunger. Our mission is to make food more accessible while minimizing waste.
          </p>
          <p>
            <Text strong>Discover Thyme and Budget Telebot:</Text> An innovative solution allowing users to reserve food items directly through Telegram.
            Access the bot <Link href="https://t.me/ThymeBudgetBot" target="_blank">@ThymeBudgetBot</Link>.
          </p>
          <p>
            <Text strong>Contact us:</Text>
          </p>
          <p>
            Our Email: <Text copyable>thymeandbudget@sit.singaporetech.edu.sg</Text>
          </p>
          <p>
            Location: 172 Ang Mo Kio Ave 8, Singapore 567739
          </p>
        </Typography>
      </Modal>
    </>
  );
};

export default AboutUsModal;