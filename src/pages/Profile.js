import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, message, Row, Select, Modal, Typography, Col, Divider } from 'antd';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import LayoutComponent from '../components/Layout';
import useProfileData from '../pages/useProfileData'; 
import styled from 'styled-components'; 

const { Option } = Select;
const { Title } = Typography;

const StyledCard = styled(Card)`
  background-color: #f8f9fa;
  color: #343a40;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 40px auto;
  text-align: left;
  max-width: 600px; 
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
`;

const MyProfile = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const { formData, setFormData, dataFetched, fetchData, clearData } = useProfileData(); 
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData(); 
    }, [fetchData]);

    const onFinish = async (values) => {
        try {
            const updatedInfo = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone_number: values.phoneNumber,
            };
            console.log('Data:', updatedInfo);
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`, 
                updatedInfo,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
    
            message.success('Profile updated successfully!');
            form.resetFields(); // Clear the form fields

            // Set the values of the disabled fields
            form.setFieldsValue({
                username: values.username,
                role: values.role,
            });

            setFormData({}); // Clear the form data
            navigate('/profile'); 
    
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile. Please try again later.');
        }
    };
    
    const handleDeleteProfile = async () => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
    
            message.success('Profile deleted successfully!');
            localStorage.removeItem('token'); 
            navigate('/login');
    
        } catch (error) {
            // Handle error response
            console.error('Error deleting profile:', error);
            message.error('Failed to delete profile. Please try again later.');
        }
    };

    const showModal = (deleteMode) => {
        setIsDeleteMode(deleteMode);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        if (isDeleteMode) {
            handleDeleteProfile();
        } else {
            form.submit();
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <LayoutComponent>
                <Row justify="center" style={{ paddingTop: '20px' }}>
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Title level={2} style={{ textAlign: 'center' }}>My Profile</Title>
                        <StyledCard>
                        {dataFetched && (
                            <Form
                                form={form}
                                name="profile"
                                onFinish={onFinish}
                                initialValues={formData}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="username"
                                    label="Username"
                                    rules={[{ required: true, message: 'Username is required!' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
        
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'First Name is required!' }]}
                                >
                                    <Input />
                                </Form.Item>
        
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Last Name is required!' }]}
                                >
                                    <Input />
                                </Form.Item>
        
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Email is required!', type: 'email' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="role"
                                    label="Role"
                                    rules={[{ required: true, message: 'Role is required!' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
        
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[{ required: true, message: 'Phone Number is required!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                
                                <Form.Item>
                                    <Button type="primary" onClick={() => showModal(false)} htmlType="button" style={{ marginRight: '8px' }}>
                                        Update Profile
                                    </Button>
                                    <DeleteButton onClick={() => showModal(true)}>
                                        Delete Profile
                                    </DeleteButton>
                                </Form.Item>
        
                                <Modal title={isDeleteMode ? "Delete Profile Confirmation" : "Update Profile Confirmation"} visible={isModalVisible} onOk={handleModalOk}
                                    onCancel={handleModalCancel}>
                                    <p>{isDeleteMode ? "Are you sure you want to delete your profile?" : "Are you sure you want to update your profile?"}</p>
                                </Modal>
                            </Form>
                        )}
                    </StyledCard>
                </Col>
            </Row>
        </LayoutComponent>
    );    
};

export default MyProfile;
