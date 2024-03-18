import React, { useEffect, useState } from 'react';
import { message, Spin, Form, Input, InputNumber, Button, Typography } from 'antd';
import axios from 'axios';
import LayoutComponent from '../components/Layout';
import {useNavigate} from 'react-router-dom';

const { Title } = Typography;

const fetchFoodItemData = async (setFoodItem, setLoading, foodId, token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/${foodId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setFoodItem(response.data);
        console.log(response.data);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching data:', error);
        }
        message.error('Failed to fetch food item. Please try again.');
    } finally {
        setLoading(false);
    }
};


export default function ReserveFoodItems() {
    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [role, setRole] = useState(null);
    const token = localStorage.getItem('token');
    const foodId = new URLSearchParams(window.location.search).get('id');
    const navigate = useNavigate();
    
    console.log(token);
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(statusResponse  => {
                setRole(statusResponse.data.role);
                fetchFoodItemData(setFoodItem, setLoading, foodId, token);
                console.log(statusResponse.data.role);
            })
            .catch(statusError  => {
                console.error('Error getting user status:', statusError);
                navigate('/login');
            });
    }, [foodId, token]);

    useEffect(() => {
        fetchFoodItemData(setFoodItem, setLoading, foodId, token);
    }, [foodId, token]);

    const defaultImageUrl = "https://via.placeholder.com/150";

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/collection/`, {
                quantity: values.quantity,
                food_item: foodId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (process.env.NODE_ENV === 'development') {
                console.log('Response:', response.data);
            }
            message.success('Food item reserved successfully');
            navigate('/viewfooditems');
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error reserving food item:', error);
            }
            if (error.response && error.response.status === 400) {
                for (const [key, value] of Object.entries(error.response.data)) {
                    message.error(`${key}: ${value}`);
                }
            }
        }
    };

    return (
        <LayoutComponent>
            <Title level={2} style={{ textAlign: 'center' }}>Reserve Food Item</Title>
            {loading ? (
                <Spin />
            ) : (
                <Form
                    layout="vertical"
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        width: '100%', 
                        maxWidth: '500px', 
                        margin: 'auto' 
                    }}
                    name="reserve_food_item"
                    onFinish={onFinish}
                >
                    <Typography.Text strong>Name:</Typography.Text>
                    <Typography.Paragraph>{foodItem.name}</Typography.Paragraph>

                    <Typography.Text strong>Image:</Typography.Text>
                    <div style={{marginBottom: '24px'}}>
                        <img
                            alt={foodItem.name}
                            src={foodItem.image || defaultImageUrl}
                            style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                    </div>

                    <Typography.Text strong>Expiry Date:</Typography.Text>
                    <Typography.Paragraph>{foodItem.expiry_date}</Typography.Paragraph>

                    <Typography.Text strong>Location:</Typography.Text>
                    <Typography.Paragraph>{foodItem.location}</Typography.Paragraph>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the quantity!',
                            },
                            {
                                type: 'number',
                                message: 'Quantity must be a number!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value < 1) {
                                        return Promise.reject(new Error('Quantity must be at least 1!'));
                                    }
                                    if (!value || (foodItem && value <= foodItem.quantity)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Quantity exceeds available quantity!'));
                                },
                            }),
                        ]}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                    >
                        <InputNumber />
                    </Form.Item>
                    <Typography.Paragraph>
                        Maximum available quantity: {foodItem ? foodItem.quantity : 'Loading...'}
                    </Typography.Paragraph>
                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '40%' }}>
                                Reserve
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            )}
        </LayoutComponent>
    );
}