import React, {useEffect, useState} from 'react';
import { List, message, Spin, Typography} from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import LayoutComponent from '../components/Layout';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";

const {Title} = Typography;

const fetchFoodData = async (setFoodItems, setLoading, token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/user_food_items/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setFoodItems(response.data);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching data:', error);
        }
        message.error('Failed to fetch food items. Please try again.');
    } finally {
        setLoading(false);
    }
};

export default function MyFoodItems() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [role, setRole] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // useEffect(() => {
    //     if (!token) {
    //         navigate('/login');
    //         return;
    //     }
    //     axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //         .then(statusResponse  => {
    //             setRole(statusResponse.data.role);
    //             fetchFoodData(setFoodItems, setLoading, token);
    //             console.log(statusResponse.data.role);
    //         })
    //         .catch(statusError  => {
    //             console.error('Error getting user status:', statusError);
    //             navigate('/login');
    //         });
    // }, []);

    useEffect(() => {
        fetchFoodData(setFoodItems, setLoading, token);
    }, [token]);

    return (
        <LayoutComponent>
            <div style={{ padding: '24px', maxWidth: '1200px', margin: 'auto' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>My Food Items</Title>
                {loading ? (
                    <Spin style={{ display: 'block', margin: '0 auto' }} />
                ) : foodItems.length > 0 ? (
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 3,
                        }}
                        dataSource={foodItems}
                        renderItem={item => (
                            <List.Item>
                                <FoodItemCard foodItem={item} />
                            </List.Item>
                        )}
                    />
                ) : (
                    <NoFoodItemCard />
                )}
            </div>
        </LayoutComponent>
    );
}