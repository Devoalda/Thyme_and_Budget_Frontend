import React, { useEffect, useState } from 'react';
import { message, Spin, Form, Input, InputNumber, Button, Typography } from 'antd';
import axios from 'axios';
import LayoutComponent from '../components/Layout';

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
    console.log(token);
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
            <Title level={2} style={{ textAlign: 'center' }}>Food Item Details</Title>
            {loading ? (
                <Spin />
            ) : (
                <Form
                style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'}}
                    name="update_food_item"
                    initialValues={foodItem}
                    onFinish={onFinish}
                >
                    <Form.Item name="name" label="Name">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="image" label="Image">
                        <img
                            alt={foodItem.name}
                            src={foodItem.image ? foodItem.image : defaultImageUrl}
                            style={{width: '100px', height: '100px', objectFit: 'cover'}}
                        />
                    </Form.Item>
                    <Form.Item name="expiry_date" label="Expiry Date">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="location" label="Location">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity">
                        <InputNumber min={1} max={foodItem.quantity} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Reserve
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </LayoutComponent>
    );
}