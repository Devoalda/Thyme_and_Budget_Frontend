import React, {useEffect, useState} from 'react';
import {Col, message, Row, Spin, Typography, Pagination, Input } from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";
import config from '../chatbot/config.js';
import MessageParser from '../chatbot/MessageParser.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import Chatbot from "react-chatbot-kit";

const {Title} = Typography;
const { Search } = Input;
const pageSize = 6; 

const rowStyle = {
    margin: '0 0 0 10px', 
  };

const fetchFoodData = async (setFood, setLoading, token) => {
    try {
        console.log('Token:', token); 

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

const renderFoodItems = (food) => {
    return food.map((item, index) => (<Col key={index} span={8}>
        <FoodItemCard foodItem={item}/>
    </Col>));
};

export default function Home() {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // get data from local storage
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');

    if (process.env.NODE_ENV === 'development') {
        console.log('Token:', token);
        console.log('Refresh:', refresh);
    }

    const indexOfLastFoodItem = currentPage * pageSize;
    const indexOfFirstFoodItem = indexOfLastFoodItem - pageSize;
    const currentFoodItems = food.slice(indexOfFirstFoodItem, indexOfLastFoodItem);

    // Handle page change
    const handlePageChange = page => {
        setCurrentPage(page);
    };

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
                console.log(statusResponse.data.role);
            })
            .catch(statusError  => {
                // Handle error
                console.error('Error getting user status:', statusError);
                navigate('/login');
            });
        fetchFoodData(setFood, setLoading, token, searchTerm);
    }, []);
    
    const onSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredFoodItems = food.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Food Items</Title>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <Search
                    placeholder="Search food items"
                    onSearch={onSearch}
                    enterButton
                    size="large"
                    style={{
                        maxWidth: '600px', 
                        borderRadius: '5px', 
                        border: '1px solid #D9E8F5', 
                    }}
                />
            </div>
            <Row gutter={16} style={{ margin: '0 16px' }}> 
                {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
                ) : filteredFoodItems.length > 0 ? (
                    renderFoodItems(filteredFoodItems)
                ) : (
                    <NoFoodItemCard />
                )}
            </Row>
            {filteredFoodItems.length > pageSize && (
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={filteredFoodItems.length}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    style={{ textAlign: 'center', margin: '20px 0' }} 
                />
            )}
        </div>
    );
}