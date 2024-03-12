import React, { useState } from 'react';
import { Modal, Button } from 'antd';

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
      <Button type="link" onClick={showModal}>
        About Us
      </Button>
      <Modal
        title="About Us"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        ]}
      >
        <p>We are a group of SIT Students that wants to help the society to reduce zero hunger.</p>
        <p>Contact details: thymeandbudget@sit.singaporetech.edu.sg</p>
        <p>172 Ang Mo Kio Ave 8, Singapore 567739</p>
      </Modal>
    </>
  );
};

export default AboutUsModal;