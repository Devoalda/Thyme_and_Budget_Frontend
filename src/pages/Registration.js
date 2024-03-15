import React, { useState } from 'react';
import { Button, Form, Input, message, Select, Space, Typography, Row, Col } from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import config from '../chatbot/config.js';
import MessageParser from '../chatbot/MessageParser.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import Chatbot from "react-chatbot-kit";
import '../css/chat.css';

const {Option} = Select;
const {Title, Text} = Typography;

const getGridFormField = (name, label, children, span = 12) => {
    return (
        <Col span={span}>
            <Form.Item
                name={name}
                label={label}
                rules={getValidationRules(name)}
            >
                {children}
            </Form.Item>
        </Col>
    );
};

// Function to handle form validation rules
const getValidationRules = (field) => {
    switch (field) {
        case 'username':
        case 'password':
        case 'first_name':
        case 'last_name':
        case 'email':
        case 'role':
        case 'phone_number':
            return [{required: true, message: `Please input your ${field}!`}];
        case 'confirm':
            return [{
                required: true, message: 'Please confirm your password!',
            }, ({getFieldValue}) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject('The two passwords do not match!');
                },
            })];
        default:
            return [];
    }
};

// Function to handle form fields
const getFormField = (name, label, children) => {
    return (<Form.Item
            name={name}
            label={label}
            rules={getValidationRules(name)}
        >
            {children}
        </Form.Item>);
};

// Function to handle form buttons
const getFormButton = (type, htmlType, text, style = {width: '100%'}) => {
    return (<Form.Item>
            <Button type={type} htmlType={htmlType} style={style}>
                {text}
            </Button>
        </Form.Item>);
};

// Main function
const RegistrationForm = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('receiver');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token !== null) {
        navigate('/');
    }

    const onFinish = async (values) => {
        // Validate data before sending
        if (!values.username || !values.password || !values.first_name || !values.last_name || !values.email || !values.role || !values.phone_number) {
            message.error('Missing required fields');
            return;
        }

        try {
            // Send post request to backend
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/register/`, {
                username: values.username,
                password: values.password,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                role: values.role,
                phone_number: values.phone_number,
            });

            message.success('Account created successfully! Redirecting to login page...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            if (error.response) {
                for (const [key, value] of Object.entries(error.response.data)) {
                    message.error(`${key}: ${value}`);
                }
            } else if (error.request) {
                message.error('Network error');
                if (process.env.NODE_ENV === 'development') {
                    console.log(error.request);
                }
            } else {
                message.error('Unknown error');
                if (process.env.NODE_ENV === 'development') {
                    console.log(error.config);
                }
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(error.config);
            }
        }
    };

    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', 
            margin: '0 auto', 
            backgroundColor: '#E6F4EA',
        }}>
        <div style={{
                width: '100%', 
                maxWidth: '500px', 
                padding: '20px',
                backgroundColor: '#fff', 
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center', 
            }}>
                {/* Logo and title here */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={{ height: '100px', margin: '20px 0' }} />
                    <h1>Thyme and Budget</h1>
                </div>
                <p style={{ margin: '10px 0 20px 0' }}>Share food, save the planet</p>
                <Form
                    name="register"
                    onFinish={onFinish}
                    initialValues={{ remember: true, role: 'receiver' }}
                    scrollToFirstError
                    style={{ margin: '20px 0' }}
                >
                <h1 style={{ textAlign: 'center', color: '#333', width: '100%' }}>Registration</h1>
                <Row gutter={[16, 16]}>
                    {getGridFormField("first_name", "First Name", <Input />, 12)}
                    {getGridFormField("last_name", "Last Name", <Input />, 12)}
                    {getGridFormField("username", "Username", <Input />, 12)}
                    {getGridFormField("password", "Password", <Input.Password />, 12)}
                    {getGridFormField("confirm", "Confirm Password", <Input.Password />, 12)}
                    {getGridFormField("email", "Email", <Input />, 12)}
                    {getGridFormField("role", "Role", (
                        <Select placeholder="Select a role" onChange={(value) => setRole(value)}>
                            <Option value="donor">Donor</Option>
                            <Option value="receiver">Receiver</Option>
                        </Select>
                    ), 12)}
                    {getGridFormField("phone_number", "Phone Number", <Input />, 12)}
                </Row>
                {getFormButton("primary", "submit", "Register")}
            </Form>
            <Button type="primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                Login
            </Button>   
        </div>
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
    </div>);
};

export default RegistrationForm;