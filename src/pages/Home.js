import React, {useEffect, useState} from 'react';
import {Col, message, Row, Spin, Typography, Pagination, Input } from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";

const { Title } = Typography;
const { Search } = Input;
const pageSize = 6; 

const rowStyle = {
    margin: '0 0 0 10px', 
  };

export default function Home() {
    const [food, setFood] = useState([]);
    const [filteredFoodItems, setFilteredFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');

    // if (process.env.NODE_ENV === 'development') {
    //     console.log('Token:', token);
    //     console.log('Refresh:', refresh);
    // }

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchFoodData(setFood, setLoading, token);
    }, [token]);

    useEffect(() => {
        // Filter food items in real-time as the searchTerm changes
        const filteredItems = food.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFoodItems(filteredItems);
        setCurrentPage(1); // Reset to first page whenever the search term changes
    }, [searchTerm, food]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    // Adjusted to include onChange event for real-time filtering
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to handle search submissions
    const onSearch = (value) => {
        // Since real-time filtering is already handled by onChange, you might not need to do anything here.
        // But if you have a specific need to handle the search submission (e.g., logging, analytics, etc.), you can do so here.
        console.log('Search submitted:', value);
        // For instance, you might want to filter based on a more complex criteria or navigate to another route.
    };

    const indexOfLastFoodItem = currentPage * pageSize;
    const indexOfFirstFoodItem = indexOfLastFoodItem - pageSize;
    const currentFoodItems = filteredFoodItems.slice(indexOfFirstFoodItem, indexOfLastFoodItem);

    return (
        <div>
            <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Food Items</Title>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <Search
                    placeholder="Search food items"
                    onChange={handleSearchChange} // Added for real-time search functionality
                    onSearch={onSearch} // Kept for potentially other search-related operations
                    enterButton
                    style={{ width: 500, height: 40 }} 
                />
            </div>
            <Row gutter={16} style={{ margin: '0 16px' }}>
                {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
                ) : currentFoodItems.length > 0 ? (
                    currentFoodItems.map((item, index) => (
                        <Col key={index} span={8}>
                            <FoodItemCard foodItem={item} />
                        </Col>
                    ))
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

async function fetchFoodData(setFood, setLoading, token) {
    try {
        const config = token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } : {};
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/`, config);
        setFood(response.data);
    } catch (error) {
        message.error('Failed to fetch food items. Please try again.');
    } finally {
        setLoading(false);
    }
}