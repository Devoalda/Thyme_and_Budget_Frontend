import React, {useEffect, useState} from 'react';
import {Col, message, Row, Spin, Typography} from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";
import config from '../chatbot/config.js';
import MessageParser from '../chatbot/MessageParser.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import Chatbot from "react-chatbot-kit";

const {Title} = Typography;

// Function to fetch food data
const fetchFoodData = async (setFood, setLoading, token) => {
    try {
        console.log('Token:', token); // Add this line

        const config = token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } : {};

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/`, config);
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', response.data);
        }
        setFood(response.data);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching data:', error);
        }
        if (error.response && error.response.status === 401) {
            message.error('Failed to fetch food items. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};

// Function to render food items
const renderFoodItems = (food) => {
    return food.map((item, index) => (<Col key={index} span={8}>
        <FoodItemCard foodItem={item}/>
    </Col>));
};

// Main function
export default function Home() {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // get data from local storage
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');

    if (process.env.NODE_ENV === 'development') {
        console.log('Token:', token);
        console.log('Refresh:', refresh);
    }

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
        fetchFoodData(setFood, setLoading, token);
    }, []);

    return (<div>
        <Title level={2} style={{textAlign: 'center'}}>Thyme and Budget Food Items</Title>
        <Row gutter={16}>
            {loading ? (<Spin/>) : food.length > 0 ? renderFoodItems(food) : (<NoFoodItemCard/>)}
        </Row>
        <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
        />
    </div>);
}