import {React, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form, Input, message, Space, Typography} from 'antd';
import axios from "axios";

const {Title, Text} = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    // if (token !== null) {
    //     window.location.href = '/home';
    // }

    const onFinish = (values) => {
        // Send post request to backend
        axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/login/`, {
            username: values.username, password: values.password,
        })
            .then(response => {
                // Set the token
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                if (process.env.NODE_ENV === 'development') {
                    localStorage.setItem('role', response.data.authenticatedUser.role);
                }

                // Send get request to /user/status/ with the token
                axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
                    headers: {
                        Authorization: `Bearer ${response.data.access}`
                    }
                })
                    .then(statusResponse  => {
                        console.log(statusResponse.data.role);
                        setRole(statusResponse.data.role);
                    })
                    .catch(statusError  => {
                        // Handle error
                        console.error('Error getting user status:', statusError);
                    });

                if (role == 'superuser') {
                    // Redirect to admin landing page
                    //navigate('/admin');
                }
                else{
                    // Redirect to user landing page
                    navigate('/home');
                }
                
            })
            .catch(error => {
                // Handle error
                message.error('Invalid username or password');
            });
    };

    const logoStyle = {
        maxWidth: '70%', // Adjust the maximum width as needed
        height: 'auto',
        margin: 'auto', // Center horizontally
    };

    return (<div style={{
            width: '300px',
            margin: 'auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
        }}>
            <Space direction="vertical" size="large" style={{width: '100%'}}>
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={logoStyle} />
                <Title level={2} style={{textAlign: 'center', color: '#343a40'}}>Thyme and Budget</Title>
                <Text style={{textAlign: 'center', color: '#6c757d'}}>Share food, save the planet</Text>
                <Form
                    name="login"
                    onFinish={onFinish}
                    initialValues={{remember: true}}
                    scrollToFirstError
                >
                    <Form.Item
                        name="username"
                        rules={[{
                            required: true, message: 'Please input your username!',
                        },]}
                    >
                        <Input size="large" placeholder="Username"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{
                            required: true, message: 'Please input your password!',
                        },]}
                    >
                        <Input.Password size="large" placeholder="Password"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" style={{width: '100%'}}>
                            Login
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="button" size="large" style={{width: '100%'}}
                                onClick={() => navigate('/')}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </div>);
};

export default Login;
