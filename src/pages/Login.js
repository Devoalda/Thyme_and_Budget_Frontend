import {React, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form, Input, message, Space, Typography} from 'antd';
import axios from "axios";

const {Title, Text} = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setRole(response.data.role);
                })
                .catch(error => {
                    console.error('Error getting user status:', error);
                });
        }
    }, []);

    useEffect(() => {
        console.log("Role:", role);
        if (role === 'superuser') {
            navigate('/admin');
        }
        else if (role !== '') {
            navigate('/');
        }
    }, [role]);

    const onFinish = (values) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/login/`, {
            username: values.username, password: values.password,
        })
            .then(response => {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                if (process.env.NODE_ENV === 'development') {
                    localStorage.setItem('role', response.data.authenticatedUser.role);
                }

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
                        console.error('Error getting user status:', statusError);
                    });
                
            })
            .catch(error => {
                message.error('Invalid username or password');
            });
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh', 
            alignItems: 'center',
            justifyContent: 'space-around', 
            backgroundColor: '#E6F4EA',
            overflow: 'hidden', 
            padding: '0 2%', 
          }}>
             <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 2%', 
            }}>
              <Title>Welcome to Thyme and Budget Website</Title>
              <Text>"Thyme and Budget is a compassionate platform dedicated to the eradication of hunger. Our mission is to foster a community where surplus food is shared,
                     not wasted. We connect donors with those in need, facilitating food donations that provide sustenance to the underprivileged and foster hope.
                     By leveraging the power of generosity and technology, Thyme and Budget aims to create a world where everyone has access to nourishing meals,
                     making zero hunger an achievable reality. Join us in the fight against hunger – because no one should go to bed hungry."</Text>
            </div>
            <div style={{
                flexBasis: '400px', 
                flexGrow: 0, 
                padding: '2%', 
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
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
                                onClick={() => navigate('/registration')}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;