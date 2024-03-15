import React, { useEffect, useState } from 'react';
import { message, Spin, Form, Input, InputNumber, Button, Typography } from 'antd';
import axios from 'axios';
import LayoutComponent from '../components/Layout';
import {useNavigate} from 'react-router-dom';

const { Title } = Typography;

// Function to fetch food item data
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
    const token = localStorage.getItem('token');
    const foodId = new URLSearchParams(window.location.search).get('id');
    const navigate = useNavigate();
    
    console.log(token);
    useEffect(() => {
        // Check if token is present
        if (!token) {
            // Redirect to login page if token is not present
            navigate('/login');
            return;
        }
        // Send get request to /user/status/ with the token
        axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(statusResponse  => {
                console.log(statusResponse.data.role);
            })
            .catch(statusError  => {
                // Handle error
                console.error('Error getting user status:', statusError);
                navigate('/login');
            });
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
                        width: '100%', // Take the full width of the container
                        maxWidth: '500px', // Set a maximum width for the form
                        margin: 'auto' // Automatically margin it for center alignment
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
                        label="Quantity to Reserve" 
                        rules={[{ required: true, message: 'Please enter the quantity!' }]}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
                    >
                        <InputNumber min={1} max={foodItem.quantity} />
                    </Form.Item>
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