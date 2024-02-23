import React, {useState, useEffect} from 'react';
import {Button, Card, Form, Input, message, Row, Select, Modal, Typography} from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import LayoutComponent from '../components/Layout';

const {Option} = Select;
const {Title} = Typography;

const cardStyle = {
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    marginBottom: '20px',
    textAlign: 'center',
};

const delete_button = {
    backgroundColor: '#ff4d4f', /* Red color */
    borderColor: '#ff4d4f',
    color: '#fff', /* White text color */
}


const MyProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        phoneNumber: '',
        postalCode: '',
    });
    const [dataFetched, setDataFetched] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Check if token is present
        if (!token) {
            // Redirect to login page if token is not present
            navigate('/login');
            return;
        }

        axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const userData = response.data;
                // console.log('User data:', userData);
                setFormData({
                    username: userData.username,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    email: userData.email,
                    role: userData.role,
                    phoneNumber: userData.phone_number,
                    postalCode: userData.postal_code,
                });
                setDataFetched(true); // Mark data as fetched
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []); // Empty dependency array to run effect only once

    const onFinish = async (values) => {
        try {
            const updatedInfo = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone_number: values.phoneNumber,
            }
            console.log('Data:', updatedInfo);
            // Send updated profile data to the backend
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`, updatedInfo,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            // Handle success message and navigation
            message.success('Profile updated successfully!');
            navigate('/profile'); // Redirect to profile page or any other desired route

        } catch (error) {
            // Handle error response
            console.error('Error updating profile:', error);
            message.error('Failed to update profile. Please try again later.');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            // Send delete request to the backend
            const response = await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            // Handle success message and navigation
            message.success('Profile deleted successfully!');
            localStorage.removeItem('token');
            navigate('/login'); // Redirect to login page or any other desired route

        } catch (error) {
            // Handle error response
            console.error('Error deleting profile:', error);
            message.error('Failed to delete profile. Please try again later.');
        }
    }

    const showModal = (isDeleteMode) => {
        setIsDeleteMode(isDeleteMode);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        if (isDeleteMode) {
            handleDeleteProfile().then(r => console.log('Profile deleted'));
        } else {
            form.submit();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const [form] = Form.useForm();


    return (
        <LayoutComponent>
            <Title level={2} style={{textAlign: 'center'}}>My Profile</Title>
            <Row gutter={16}>
                <Card style={cardStyle}>
                    {dataFetched && ( // Only render form when data is fetched
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
                                rules={[{required: true, message: 'Please do not leave First Name blank!'}]}
                            >
                                <Input disabled/>
                            </Form.Item>

                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{required: true, message: 'Please do not leave it blank!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{required: true, message: 'Please do not leave Last Name blank!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{required: true, message: 'Please do not leave email blank!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{required: true, message: 'Please do not leave role blank!'}]}
                            >
                                <Select placeholder="Select a role" disabled>
                                    <Option value="donor">Donor</Option>
                                    <Option value="receiver">Receiver</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{required: true, message: 'Please do not leave phone number blank!'}]}
                            >
                                <Input/>
                            </Form.Item>


                            {/* Add other form fields as needed */}
                            <Button type="primary" onClick={() => showModal(false)}>
                                Update Profile
                            </Button>
                            <Button style={delete_button} onClick={() => showModal(true)}>
                                Delete Profile
                            </Button>
                            <Modal title={isDeleteMode ? "Delete Profile Confirmation" : "Update Profile Confirmation"} visible={isModalVisible} onOk={handleOk}
                                   onCancel={handleCancel}>
                                <p>{isDeleteMode ? "Are you sure you want to delete your profile?" : "Are you sure you want to update your profile?"}</p>
                            </Modal>
                        </Form>
                    )}
                </Card>
            </Row>
        </LayoutComponent>
    );
};

export default MyProfile
