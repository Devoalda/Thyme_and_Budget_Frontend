import React, { useEffect, useState } from 'react';
import { message, Spin, Table, Button } from 'antd';
import axios from 'axios';
import LayoutComponent from '../components/Layout';

// Function to fetch reserved food items
const fetchReservedFoodItems = async (setReservedFoodItems, setLoading, token) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/collection/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const foodItemsData = await Promise.all(response.data.map(async (item) => {
            const foodItemData = await fetchFoodItemData(item.food_item, token);
            console.log(foodItemData);
            return { ...item, foodItemData };
        }));

        setReservedFoodItems(foodItemsData);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching data:', error);
        }
        message.error('Failed to fetch reserved food items. Please try again.');
    } finally {
        setLoading(false);
    }
};

// Function to fetch food item data
const fetchFoodItemData = async (id, token) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/food/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching data:', error);
        }
        message.error('Failed to fetch food item. Please try again.');
    }
};

export default function ConfirmFoodCollection() {
    const [reservedFoodItems, setReservedFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collectedItems, setCollectedItems] = useState([]); // New state variable
    const token = localStorage.getItem('token');

    const confirmCollection = async (record, token) => {
        try {
            const requestData = {
                quantity: 0,
                phone_number: record.phone_number,
                food_item: record.food_item,
            };
            console.log('Request data:', requestData); // Log the request data

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/collection/${record.id}/`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Response:', response); // Log the response

            message.success('Food item collected successfully');
            setCollectedItems([...collectedItems, record.id]); // Add the collected item's id to the state
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error confirming collection:', error);
            }
            message.error('Failed to confirm collection. Please try again.');
        }
    };

    useEffect(() => {
        fetchReservedFoodItems(setReservedFoodItems, setLoading, token);
    }, [token]);

    const columns = [
        {
            title: 'Food Item',
            dataIndex: ['foodItemData', 'name'],
            key: 'food_item',
        },
        {
            title: 'Expiry Date',
            dataIndex: ['foodItemData', 'expiry_date'],
            key: 'expiry_date',
        },
        {
            title: 'Location',
            dataIndex: ['foodItemData', 'location'],
            key: 'location',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                collectedItems.includes(record.id) || record.quantity === 0 ? // Check if the item has been collected or quantity is 0
                    <span style={{color: 'green'}}>Collected</span> : // If yes, show "Collected"
                    <Button onClick={() => confirmCollection(record, token)}>Confirm Collection</Button> // If no, show the button
            ),
        },
    ];

    return (
        <LayoutComponent>
            <h2 style={{ textAlign: 'center' }}>Reserved Food Items</h2>
            {loading ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={reservedFoodItems} rowKey="id" />
            )}
        </LayoutComponent>
    );
}